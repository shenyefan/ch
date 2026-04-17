import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

type ChapterTranslationInput = {
  title?: string | null;
  paragraphs?: string[];
};

function unauthorized(auth: Awaited<ReturnType<typeof getAuthUserFromRequest>>) {
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

async function upsertChapterTranslations(chapterId: number, translations: Record<string, ChapterTranslationInput>) {
  const languages: Array<'en' | 'zh' | 'ar'> = ['en', 'zh', 'ar'];
  for (const language of languages) {
    const translation = translations[language];
    if (!translation) continue;
    const paragraphs = Array.isArray(translation.paragraphs)
      ? translation.paragraphs.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];

    await sql`
      WITH updated AS (
        UPDATE feature_chapter_translations
        SET title = ${translation.title?.trim() || null},
            paragraphs = ${JSON.stringify(paragraphs)}::jsonb,
            updated_at = NOW()
        WHERE chapter_id = ${chapterId}
          AND language = ${language}
        RETURNING id
      )
      INSERT INTO feature_chapter_translations (chapter_id, language, title, paragraphs)
      SELECT ${chapterId}, ${language}, ${translation.title?.trim() || null}, ${JSON.stringify(paragraphs)}::jsonb
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
      ch.id,
      ch.modal_slug,
      ch.slug,
      ch.images,
      ch.sort_order,
      COALESCE((
        SELECT JSONB_OBJECT_AGG(
          t.language,
          JSONB_BUILD_OBJECT(
            'title', t.title,
            'paragraphs', t.paragraphs
          )
        )
        FROM feature_chapter_translations t
        WHERE t.chapter_id = ch.id
      ), '{}'::jsonb) AS translations
    FROM feature_chapters ch
    ORDER BY ch.modal_slug ASC, ch.sort_order ASC, ch.id ASC
  `;

  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const body = await req.json();
  const modalSlug = typeof body?.modal_slug === 'string' ? body.modal_slug.trim() : '';
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
  const images = Array.isArray(body?.images)
    ? body.images.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const sortOrder = Number(body?.sort_order ?? 0);
  const translations = (body?.translations ?? {}) as Record<string, ChapterTranslationInput>;

  if (!modalSlug || !slug) {
    return NextResponse.json({ error: 'modal_slug and slug are required' }, { status: 400 });
  }

  const [chapter] = await sql`
    INSERT INTO feature_chapters (modal_slug, slug, images, sort_order)
    VALUES (${modalSlug}, ${slug}, ${JSON.stringify(images)}::jsonb, ${sortOrder})
    RETURNING id
  `;

  await upsertChapterTranslations(chapter.id, translations);
  return NextResponse.json({ id: chapter.id }, { status: 201 });
}