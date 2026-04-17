import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modalSlug: string }> }
) {
  const { modalSlug } = await params;
  const lang = request.nextUrl.searchParams.get('lang') || 'en';

  const chapters = await sql`
    SELECT
      ch.id,
      ch.slug,
      ch.images,
      ch.sort_order,
      t.title,
      t.paragraphs
    FROM feature_chapters ch
    JOIN feature_chapter_translations t ON t.chapter_id = ch.id AND t.language = ${lang}
    WHERE ch.modal_slug = ${modalSlug}
    ORDER BY ch.sort_order
  `;

  if (chapters.length === 0) {
    return NextResponse.json({ error: 'No chapters found for this modal' }, { status: 404 });
  }

  return NextResponse.json(chapters);
}
