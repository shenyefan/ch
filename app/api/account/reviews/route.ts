import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await sql`
    SELECT
      r.id,
      r.author_name,
      r.content,
      r.rating,
      r.status,
      r.created_at,
      c.slug AS city_slug,
      ct.name AS city_name
    FROM reviews r
    LEFT JOIN cities c ON c.id = r.city_id
    LEFT JOIN city_translations ct ON ct.city_id = c.id AND ct.language = 'en'
    WHERE r.user_id = ${auth.userId}
    ORDER BY r.created_at DESC
  `;

  return NextResponse.json({ data: rows });
}