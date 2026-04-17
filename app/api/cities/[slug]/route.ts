import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Language = 'en' | 'zh' | 'ar';
type Params = { params: Promise<{ slug: string }> };

/**
 * GET /api/cities/[slug]
 * 查询参数:
 *   lang  - 语言代码，默认 'en'，可选 'zh' | 'ar'
 *
 * 返回单个城市的详情，包含该城市所有激活景点（含翻译）
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

  // 查询城市
  const [city] = await sql`
    SELECT
      c.id,
      c.slug,
      c.center_lat,
      c.center_lng,
      c.zoom_level,
      c.featured_image,
      c.hero_video_url,
      c.gallery_images,
      ct.name,
      ct.subtitle,
      ct.short_bio,
      ct.description
    FROM cities c
    JOIN city_translations ct
      ON ct.city_id = c.id
      AND ct.language = ${lang}
    WHERE c.slug = ${slug}
      AND c.is_active = TRUE
  `;

  if (!city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  // 查询该城市的所有景点
  const landmarks = await sql`
    SELECT
      lm.id,
      lm.slug,
      lm.latitude,
      lm.longitude,
      lm.category,
      lm.featured_image,
      lm.is_featured,
      lm.sort_order,
      lt.name,
      lt.short_description,
      lt.description,
      lt.historical_background,
      lt.visiting_tips
    FROM landmarks lm
    JOIN landmark_translations lt
      ON lt.landmark_id = lm.id
      AND lt.language = ${lang}
    WHERE lm.city_id = ${city.id}
      AND lm.is_active = TRUE
    ORDER BY lm.sort_order ASC, lm.id ASC
  `;

  return NextResponse.json({ data: { ...city, landmarks } });
}
