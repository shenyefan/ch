import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Language = 'en' | 'zh' | 'ar';
type Params = { params: Promise<{ slug: string }> };

/**
 * GET /api/landmarks/[slug]
 * 查询参数:
 *   lang  - 语言代码，默认 'en'，可选 'zh' | 'ar'
 *
 * 返回单个景点的完整详情（含所属城市信息和翻译内容）
 */
export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const { searchParams } = request.nextUrl;
  const lang: Language = (searchParams.get('lang') as Language) ?? 'en';

  if (!['en', 'zh', 'ar'].includes(lang)) {
    return NextResponse.json(
      { error: 'Invalid lang parameter. Must be one of: en, zh, ar' },
      { status: 400 }
    );
  }

  const [row] = await sql`
    SELECT
      lm.id,
      lm.slug,
      lm.latitude,
      lm.longitude,
      lm.category,
      lm.featured_image,
      lm.is_featured,
      c.id     AS city_id,
      c.slug   AS city_slug,
      c.center_lat,
      c.center_lng,
      c.zoom_level,
      ct.name  AS city_name,
      lt.name,
      lt.short_description,
      lt.description,
      lt.historical_background,
      lt.visiting_tips
    FROM landmarks lm
    JOIN cities c
      ON c.id = lm.city_id
    JOIN city_translations ct
      ON ct.city_id = c.id
      AND ct.language = ${lang}
    JOIN landmark_translations lt
      ON lt.landmark_id = lm.id
      AND lt.language = ${lang}
    WHERE lm.slug     = ${slug}
      AND lm.is_active = TRUE
      AND c.is_active  = TRUE
  `;

  if (!row) {
    return NextResponse.json({ error: 'Landmark not found' }, { status: 404 });
  }

  return NextResponse.json({ data: row });
}
