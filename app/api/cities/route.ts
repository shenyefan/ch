  import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export type Language = 'en' | 'zh' | 'ar';

/**
 * GET /api/cities
 * 查询参数:
 *   lang  - 语言代码，默认 'en'，可选 'zh' | 'ar'
 *
 * 返回所有激活城市的列表（含对应语言的翻译内容）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lang: Language = (searchParams.get('lang') as Language) ?? 'en';
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number.parseInt(limitParam, 10) : null;

  if (!['en', 'zh', 'ar'].includes(lang)) {
    return NextResponse.json(
      { error: 'Invalid lang parameter. Must be one of: en, zh, ar' },
      { status: 400 }
    );
  }

  if (limitParam && (!Number.isFinite(limit) || (limit ?? 0) <= 0)) {
    return NextResponse.json(
      { error: 'Invalid limit parameter. Must be a positive integer.' },
      { status: 400 }
    );
  }

  const rows = await sql`
    SELECT
      c.id,
      c.slug,
      c.center_lat,
      c.center_lng,
      c.zoom_level,
      c.featured_image,
      c.featured_image AS image_url,
      c.hero_video_url,
      c.gallery_images,
      c.sort_order,
      COALESCE((
        SELECT ROUND(AVG(r.rating)::numeric, 1)
        FROM reviews r
        WHERE r.city_id = c.id
          AND r.status = 'approved'
          AND r.rating IS NOT NULL
      ), 0)::float8 AS avg_rating,
      (
        SELECT COUNT(*)::int
        FROM reviews r
        WHERE r.city_id = c.id
          AND r.status = 'approved'
      ) AS review_count,
      ct.name,
      ct.subtitle,
      ct.short_bio,
      ct.description
    FROM cities c
    JOIN city_translations ct
      ON ct.city_id = c.id
      AND ct.language = ${lang}
    WHERE c.is_active = TRUE
    ORDER BY c.sort_order ASC, c.id ASC
    LIMIT COALESCE(${limit}, 100)
  `;

  return NextResponse.json({ data: rows });
}
