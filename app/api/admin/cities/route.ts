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

export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const rows = await sql`
    SELECT
      c.id,
      c.slug,
      c.center_lat,
      c.center_lng,
      c.zoom_level,
      c.featured_image,
      c.hero_video_url,
      c.gallery_images,
      c.sort_order,
      c.is_active,
      COALESCE((
        SELECT JSONB_OBJECT_AGG(
          ct.language,
          JSONB_BUILD_OBJECT(
            'name', ct.name,
            'subtitle', ct.subtitle,
            'short_bio', ct.short_bio,
            'description', ct.description
          )
        )
        FROM city_translations ct
        WHERE ct.city_id = c.id
      ), '{}'::jsonb) AS translations
    FROM cities c
    ORDER BY c.sort_order ASC, c.id ASC
  `;

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

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

  if (!slug || !Number.isFinite(centerLat) || !Number.isFinite(centerLng)) {
    return NextResponse.json({ error: 'slug, center_lat, center_lng are required' }, { status: 400 });
  }

  if (!translations.en?.name?.trim()) {
    return NextResponse.json({ error: 'English translation name is required' }, { status: 400 });
  }

  const [city] = await sql`
    INSERT INTO cities (
      slug, center_lat, center_lng, zoom_level,
      featured_image, hero_video_url, gallery_images,
      sort_order, is_active
    ) VALUES (
      ${slug}, ${centerLat}, ${centerLng}, ${zoomLevel},
      ${featuredImage || null}, ${heroVideoUrl || null}, ${JSON.stringify(galleryImages)}::jsonb,
      ${sortOrder}, ${isActive}
    )
    RETURNING id
  `;

  await upsertCityTranslations(city.id, translations);
  return NextResponse.json({ id: city.id }, { status: 201 });
}