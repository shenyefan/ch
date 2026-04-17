import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [user] = await sql`
    SELECT id, email, name, role, avatar_url, created_at
    FROM users
    WHERE id = ${auth.userId} AND is_active = TRUE
  `;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
