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

export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const rows = await sql`
    SELECT
      lm.id,
      lm.city_id,
      c.slug AS city_slug,
      lm.slug,
      lm.latitude,
      lm.longitude,
      lm.category,
      lm.featured_image,
      lm.is_featured,
      lm.sort_order,
      lm.is_active,
      COALESCE((
        SELECT JSONB_OBJECT_AGG(
          lt.language,
          JSONB_BUILD_OBJECT(
            'name', lt.name,
            'short_description', lt.short_description,
            'description', lt.description,
            'historical_background', lt.historical_background,
            'visiting_tips', lt.visiting_tips
          )
        )
        FROM landmark_translations lt
        WHERE lt.landmark_id = lm.id
      ), '{}'::jsonb) AS translations
    FROM landmarks lm
    JOIN cities c ON c.id = lm.city_id
    ORDER BY c.slug ASC, lm.sort_order ASC, lm.id ASC
  `;

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

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

  if (!Number.isInteger(cityId) || !slug || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: 'city_id, slug, latitude, longitude are required' }, { status: 400 });
  }

  const [landmark] = await sql`
    INSERT INTO landmarks (
      city_id, slug, latitude, longitude, category,
      featured_image, is_featured, sort_order, is_active
    ) VALUES (
      ${cityId}, ${slug}, ${latitude}, ${longitude}, ${category},
      ${featuredImage || null}, ${isFeatured}, ${sortOrder}, ${isActive}
    )
    RETURNING id
  `;

  await upsertLandmarkTranslations(landmark.id, translations);
  return NextResponse.json({ id: landmark.id }, { status: 201 });
}