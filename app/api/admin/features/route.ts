import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

type FeatureTranslationInput = {
  title: string;
  description?: string | null;
};

function unauthorized(auth: Awaited<ReturnType<typeof getAuthUserFromRequest>>) {
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

async function upsertFeatureTranslations(featureId: number, translations: Record<string, FeatureTranslationInput>) {
  const languages: Array<'en' | 'zh' | 'ar'> = ['en', 'zh', 'ar'];
  for (const language of languages) {
    const translation = translations[language];
    if (!translation?.title?.trim()) continue;
    await sql`
      WITH updated AS (
        UPDATE city_feature_translations
        SET title = ${translation.title.trim()},
            description = ${translation.description?.trim() || null},
            updated_at = NOW()
        WHERE feature_id = ${featureId}
          AND language = ${language}
        RETURNING id
      )
      INSERT INTO city_feature_translations (
        feature_id, language, title, description
      )
      SELECT
        ${featureId}, ${language}, ${translation.title.trim()},
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
      f.id,
      f.city_id,
      c.slug AS city_slug,
      f.slug,
      f.card_image,
      f.interactive_url,
      f.statues_url,
      f.modal_slug,
      f.sort_order,
      f.is_active,
      COALESCE((
        SELECT JSONB_OBJECT_AGG(
          t.language,
          JSONB_BUILD_OBJECT(
            'title', t.title,
            'description', t.description
          )
        )
        FROM city_feature_translations t
        WHERE t.feature_id = f.id
      ), '{}'::jsonb) AS translations
    FROM city_features f
    JOIN cities c ON c.id = f.city_id
    ORDER BY c.slug ASC, f.sort_order ASC, f.id ASC
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
  const cardImage = typeof body?.card_image === 'string' ? body.card_image.trim() : '';
  const interactiveUrl = typeof body?.interactive_url === 'string' ? body.interactive_url.trim() : '';
  const statuesUrl = typeof body?.statues_url === 'string' ? body.statues_url.trim() : '';
  const modalSlug = typeof body?.modal_slug === 'string' ? body.modal_slug.trim() : '';
  const sortOrder = Number(body?.sort_order ?? 0);
  const isActive = typeof body?.is_active === 'boolean' ? body.is_active : true;
  const translations = (body?.translations ?? {}) as Record<string, FeatureTranslationInput>;

  if (!Number.isInteger(cityId) || !slug) {
    return NextResponse.json({ error: 'city_id and slug are required' }, { status: 400 });
  }

  const [feature] = await sql`
    INSERT INTO city_features (
      city_id, slug, card_image, interactive_url, statues_url, modal_slug, sort_order, is_active
    ) VALUES (
      ${cityId}, ${slug}, ${cardImage || null}, ${interactiveUrl || null}, ${statuesUrl || null}, ${modalSlug || null}, ${sortOrder}, ${isActive}
    )
    RETURNING id
  `;

  await upsertFeatureTranslations(feature.id, translations);
  return NextResponse.json({ id: feature.id }, { status: 201 });
}