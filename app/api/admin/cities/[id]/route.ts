import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

type TranslationInput = {
  name: string;
  subtitle?: string | null;
  short_bio?: string | null;
  description?: string | null;
};

function unauthorized(auth: Awaited<ReturnType<typeof getAuthUserFromRequest>>) {
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

async function upsertCityTranslations(cityId: number, translations: Record<string, TranslationInput>) {
  const languages: Array<'en' | 'zh' | 'ar'> = ['en', 'zh', 'ar'];
  for (const language of languages) {
    const translation = translations[language];
    if (!translation?.name?.trim()) continue;
    await sql`
      WITH updated AS (
        UPDATE city_translations
        SET name = ${translation.name.trim()},
            subtitle = ${translation.subtitle?.trim() || null},
            short_bio = ${translation.short_bio?.trim() || null},
            description = ${translation.description?.trim() || null},
            updated_at = NOW()
        WHERE city_id = ${cityId}
          AND language = ${language}
        RETURNING id
      )
      INSERT INTO city_translations (city_id, language, name, subtitle, short_bio, description)
      SELECT
        ${cityId},
        ${language},
        ${translation.name.trim()},
        ${translation.subtitle?.trim() || null},
        ${translation.short_bio?.trim() || null},
        ${translation.description?.trim() || null}
      WHERE NOT EXISTS (SELECT 1 FROM updated)
    `;
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const cityId = Number(id);
  if (!Number.isInteger(cityId) || cityId < 1) {
    return NextResponse.json({ error: 'Invalid city id' }, { status: 400 });
  }

  const body = await req.json();
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
  const centerLat = Number(body?.center_lat);
  const centerLng = Number(body?.center_lng);
  const zoomLevel = Number(body?.zoom_level ?? 12);
  const featuredImage = typeof body?.featured_image === 'string' ? body.featured_image.trim() : '';
  const heroVideoUrl = typeof body?.hero_video_url === 'string' ? body.hero_video_url.trim() : '';
  const galleryImages = Array.isArray(body?.gallery_images)
    ? body.gallery_images.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const sortOrder = Number(body?.sort_order ?? 0);
  const isActive = typeof body?.is_active === 'boolean' ? body.is_active : true;
  const translations = (body?.translations ?? {}) as Record<string, TranslationInput>;

  const [city] = await sql`
    UPDATE cities
    SET slug = ${slug},
        center_lat = ${centerLat},
        center_lng = ${centerLng},
        zoom_level = ${zoomLevel},
        featured_image = ${featuredImage || null},
        hero_video_url = ${heroVideoUrl || null},
        gallery_images = ${JSON.stringify(galleryImages)}::jsonb,
        sort_order = ${sortOrder},
        is_active = ${isActive},
        updated_at = NOW()
    WHERE id = ${cityId}
    RETURNING id
  `;

  if (!city) return NextResponse.json({ error: 'City not found' }, { status: 404 });
  await upsertCityTranslations(cityId, translations);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const cityId = Number(id);
  if (!Number.isInteger(cityId) || cityId < 1) {
    return NextResponse.json({ error: 'Invalid city id' }, { status: 400 });
  }

  const [deleted] = await sql`DELETE FROM cities WHERE id = ${cityId} RETURNING id`;
  if (!deleted) return NextResponse.json({ error: 'City not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}