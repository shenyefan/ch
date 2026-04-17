import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

type LandmarkTranslationInput = {
  name: string;
  short_description?: string | null;
  description?: string | null;
  historical_background?: string | null;
  visiting_tips?: string | null;
};

function unauthorized(auth: Awaited<ReturnType<typeof getAuthUserFromRequest>>) {
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

async function upsertLandmarkTranslations(landmarkId: number, translations: Record<string, LandmarkTranslationInput>) {
  const languages: Array<'en' | 'zh' | 'ar'> = ['en', 'zh', 'ar'];
  for (const language of languages) {
    const translation = translations[language];
    if (!translation?.name?.trim()) continue;
    await sql`
      WITH updated AS (
        UPDATE landmark_translations
        SET name = ${translation.name.trim()},
            short_description = ${translation.short_description?.trim() || null},
            description = ${translation.description?.trim() || null},
            historical_background = ${translation.historical_background?.trim() || null},
            visiting_tips = ${translation.visiting_tips?.trim() || null},
            updated_at = NOW()
        WHERE landmark_id = ${landmarkId}
          AND language = ${language}
        RETURNING id
      )
      INSERT INTO landmark_translations (
        landmark_id, language, name, short_description, description, historical_background, visiting_tips
      )
      SELECT
        ${landmarkId}, ${language}, ${translation.name.trim()},
        ${translation.short_description?.trim() || null},
        ${translation.description?.trim() || null},
        ${translation.historical_background?.trim() || null},
        ${translation.visiting_tips?.trim() || null}
      WHERE NOT EXISTS (SELECT 1 FROM updated)
    `;
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const landmarkId = Number(id);
  if (!Number.isInteger(landmarkId) || landmarkId < 1) {
    return NextResponse.json({ error: 'Invalid landmark id' }, { status: 400 });
  }

  const body = await req.json();
  const cityId = Number(body?.city_id);
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
  const latitude = Number(body?.latitude);
  const longitude = Number(body?.longitude);
  const category = typeof body?.category === 'string' ? body.category.trim() : 'other';
  const featuredImage = typeof body?.featured_image === 'string' ? body.featured_image.trim() : '';
  const isFeatured = typeof body?.is_featured === 'boolean' ? body.is_featured : false;
  const sortOrder = Number(body?.sort_order ?? 0);
  const isActive = typeof body?.is_active === 'boolean' ? body.is_active : true;
  const translations = (body?.translations ?? {}) as Record<string, LandmarkTranslationInput>;

  const [landmark] = await sql`
    UPDATE landmarks
    SET city_id = ${cityId},
        slug = ${slug},
        latitude = ${latitude},
        longitude = ${longitude},
        category = ${category},
        featured_image = ${featuredImage || null},
        is_featured = ${isFeatured},
        sort_order = ${sortOrder},
        is_active = ${isActive},
        updated_at = NOW()
    WHERE id = ${landmarkId}
    RETURNING id
  `;

  if (!landmark) return NextResponse.json({ error: 'Landmark not found' }, { status: 404 });
  await upsertLandmarkTranslations(landmarkId, translations);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const landmarkId = Number(id);
  if (!Number.isInteger(landmarkId) || landmarkId < 1) {
    return NextResponse.json({ error: 'Invalid landmark id' }, { status: 400 });
  }

  const [deleted] = await sql`DELETE FROM landmarks WHERE id = ${landmarkId} RETURNING id`;
  if (!deleted) return NextResponse.json({ error: 'Landmark not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}