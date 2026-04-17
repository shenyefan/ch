import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

/**
 * GET /api/admin/reviews?status=pending&city=beijing&page=1&limit=20
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status'); // pending | approved | rejected | null (all)
  const citySlug = searchParams.get('city');
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
  const page = Math.max(Number(searchParams.get('page') ?? 1), 1);
  const offset = (page - 1) * limit;

  const validStatuses = ['pending', 'approved', 'rejected'];
  const statusFilter = status && validStatuses.includes(status) ? status : null;

  const rows = await sql`
    SELECT
      r.id,
      r.author_name,
      r.content,
      r.rating,
      r.status,
      r.created_at,
      c.slug  AS city_slug,
      u.email AS user_email
    FROM reviews r
    LEFT JOIN cities c ON c.id = r.city_id
    LEFT JOIN users  u ON u.id  = r.user_id
    WHERE (${statusFilter}::text IS NULL OR r.status = ${statusFilter})
      AND (${citySlug}::text   IS NULL OR c.slug   = ${citySlug})
    ORDER BY r.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ total }] = await sql`
    SELECT COUNT(*)::int AS total
    FROM reviews r
    LEFT JOIN cities c ON c.id = r.city_id
    WHERE (${statusFilter}::text IS NULL OR r.status = ${statusFilter})
      AND (${citySlug}::text     IS NULL OR c.slug   = ${citySlug})
  `;

  return NextResponse.json({ data: rows, total, page, limit });
}
