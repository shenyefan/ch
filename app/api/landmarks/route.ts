import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Language = 'en' | 'zh' | 'ar';

/**
 * GET /api/landmarks
 * 查询参数:
 *   lang      - 语言代码，默认 'en'，可选 'zh' | 'ar'
 *   city      - 城市 slug，可选，用于过滤指定城市的景点
 *   category  - 景点类型，可选，如 'palace' | 'garden' | 'wall' 等
 *   featured  - 'true' 只返回精选景点
 *
 * 返回景点列表（含翻译内容）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lang: Language = (searchParams.get('lang') as Language) ?? 'en';
  const citySlug = searchParams.get('city');
  const category = searchParams.get('category');
  const featuredOnly = searchParams.get('featured') === 'true';

  if (!['en', 'zh', 'ar'].includes(lang)) {
    return NextResponse.json(
      { error: 'Invalid lang parameter. Must be one of: en, zh, ar' },
      { status: 400 }
    );
  }

  const rows = await sql`
    SELECT
      lm.id,
      lm.slug,
      lm.latitude,
      lm.longitude,
      lm.category,
      lm.featured_image,
      lm.is_featured,
      lm.sort_order,
      c.slug   AS city_slug,
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
    WHERE lm.is_active = TRUE
      AND c.is_active  = TRUE
      AND (${citySlug}::text   IS NULL OR c.slug        = ${citySlug})
      AND (${category}::text   IS NULL OR lm.category   = ${category})
      AND (${featuredOnly}     = FALSE  OR lm.is_featured = TRUE)
    ORDER BY c.sort_order ASC, lm.sort_order ASC, lm.id ASC
  `;

  return NextResponse.json({ data: rows });
}
