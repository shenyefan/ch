import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

function adminOnly(auth: Awaited<ReturnType<typeof getAuthUserFromRequest>>) {
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

/**
 * GET /api/admin/users?page=1&limit=20&search=
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  const err = adminOnly(auth);
  if (err) return err;

  const { searchParams } = req.nextUrl;
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
  const page = Math.max(Number(searchParams.get('page') ?? 1), 1);
  const offset = (page - 1) * limit;
  const search = searchParams.get('search') ?? '';
  const searchWild = `%${search}%`;

  const rows = await sql`
    SELECT id, email, name, role, is_active, created_at
    FROM users
    WHERE (${search} = '' OR name ILIKE ${searchWild} OR email ILIKE ${searchWild})
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ total }] = await sql`
    SELECT COUNT(*)::int AS total FROM users
    WHERE (${search} = '' OR name ILIKE ${searchWild} OR email ILIKE ${searchWild})
  `;

  return NextResponse.json({ data: rows, total, page, limit });
}
