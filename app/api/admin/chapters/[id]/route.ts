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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const chapterId = Number(id);
  if (!Number.isInteger(chapterId) || chapterId < 1) {
    return NextResponse.json({ error: 'Invalid chapter id' }, { status: 400 });
  }

  const body = await req.json();
  const modalSlug = typeof body?.modal_slug === 'string' ? body.modal_slug.trim() : '';
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
  const images = Array.isArray(body?.images)
    ? body.images.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const sortOrder = Number(body?.sort_order ?? 0);
  const translations = (body?.translations ?? {}) as Record<string, ChapterTranslationInput>;

  const [chapter] = await sql`
    UPDATE feature_chapters
    SET modal_slug = ${modalSlug},
        slug = ${slug},
        images = ${JSON.stringify(images)}::jsonb,
        sort_order = ${sortOrder},
        updated_at = NOW()
    WHERE id = ${chapterId}
    RETURNING id
  `;

  if (!chapter) return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  await upsertChapterTranslations(chapterId, translations);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUserFromRequest(req);
  const err = unauthorized(auth);
  if (err) return err;

  const { id } = await params;
  const chapterId = Number(id);
  if (!Number.isInteger(chapterId) || chapterId < 1) {
    return NextResponse.json({ error: 'Invalid chapter id' }, { status: 400 });
  }

  const [deleted] = await sql`DELETE FROM feature_chapters WHERE id = ${chapterId} RETURNING id`;
  if (!deleted) return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}