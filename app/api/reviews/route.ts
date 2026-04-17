import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

/**
 * GET /api/reviews?city=beijing&limit=10&page=1
 * 公开接口，只返回 approved 评论
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const citySlug = searchParams.get('city');
  const limit = Math.min(Number(searchParams.get('limit') ?? 10), 50);
  const page = Math.max(Number(searchParams.get('page') ?? 1), 1);
  const offset = (page - 1) * limit;

  const rows = await sql`
    SELECT
      r.id,
      r.author_name,
      r.content,
      r.rating,
      r.created_at,
      c.slug  AS city_slug,
      c.name  AS city_name,
      c.id    AS city_id
    FROM reviews r
    LEFT JOIN cities c ON c.id = r.city_id
    WHERE r.status = 'approved'
      AND (${citySlug}::text IS NULL OR c.slug = ${citySlug})
    ORDER BY r.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ total }] = await sql`
    SELECT COUNT(*)::int AS total
    FROM reviews r
    LEFT JOIN cities c ON c.id = r.city_id
    WHERE r.status = 'approved'
      AND (${citySlug}::text IS NULL OR c.slug = ${citySlug})
  `;

  return NextResponse.json({ data: rows, total, page, limit });
}

/**
 * POST /api/reviews
 * 需要登录。评论默认为 pending，等待管理员审核。
 */
export async function POST(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { city_slug, content, rating } = body ?? {};

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }
  if (content.trim().length > 2000) {
    return NextResponse.json({ error: 'content must be 2000 characters or less' }, { status: 400 });
  }
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: 'rating must be an integer between 1 and 5' }, { status: 400 });
  }

  // 获取城市 id（可选）
  let cityId: number | null = null;
  if (city_slug) {
    const [city] = await sql`SELECT id FROM cities WHERE slug = ${city_slug}`;
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    cityId = city.id;
  }

  // 获取用户名
  const [user] = await sql`SELECT name FROM users WHERE id = ${auth.userId}`;

  const [review] = await sql`
    INSERT INTO reviews (user_id, city_id, author_name, content, rating, status)
    VALUES (
      ${auth.userId},
      ${cityId},
      ${user.name},
      ${content.trim()},
      ${rating ?? null},
      'pending'
    )
    RETURNING id, author_name, content, rating, status, created_at
  `;

  return NextResponse.json({ review }, { status: 201 });
}
