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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const featureId = Number(id);
  if (!Number.isInteger(featureId) || featureId < 1) {
    return NextResponse.json({ error: 'Invalid feature id' }, { status: 400 });
  }

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

  const [feature] = await sql`
    UPDATE city_features
    SET city_id = ${cityId},
        slug = ${slug},
        card_image = ${cardImage || null},
        interactive_url = ${interactiveUrl || null},
      statues_url = ${statuesUrl || null},
        modal_slug = ${modalSlug || null},
        sort_order = ${sortOrder},
        is_active = ${isActive},
        updated_at = NOW()
    WHERE id = ${featureId}
    RETURNING id
  `;

  if (!feature) return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
  await upsertFeatureTranslations(featureId, translations);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const featureId = Number(id);
  if (!Number.isInteger(featureId) || featureId < 1) {
    return NextResponse.json({ error: 'Invalid feature id' }, { status: 400 });
  }

  const [deleted] = await sql`DELETE FROM city_features WHERE id = ${featureId} RETURNING id`;
  if (!deleted) return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}