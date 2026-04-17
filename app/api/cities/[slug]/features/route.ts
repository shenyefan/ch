import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lang = request.nextUrl.searchParams.get('lang') || 'en';

  const rows = await sql`
    SELECT
      f.id,
      f.slug,
      f.card_image,
      f.interactive_url,
      f.statues_url,
      f.modal_slug,
      f.sort_order,
      t.title,
      t.description
    FROM city_features f
    JOIN city_feature_translations t ON t.feature_id = f.id AND t.language = ${lang}
    JOIN cities c ON c.id = f.city_id
    WHERE c.slug = ${slug}
      AND f.is_active = TRUE
    ORDER BY f.sort_order
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No features found for this city' }, { status: 404 });
  }

  return NextResponse.json(rows);
}
