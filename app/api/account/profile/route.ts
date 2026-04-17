import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await sql`
    SELECT id, email, name, avatar_url, role, created_at, updated_at
    FROM users
    WHERE id = ${auth.userId} AND is_active = TRUE
  `;

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const avatarUrl = typeof body?.avatar_url === 'string' ? body.avatar_url.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const [user] = await sql`
    UPDATE users
    SET name = ${name},
        avatar_url = ${avatarUrl || null},
        updated_at = NOW()
    WHERE id = ${auth.userId} AND is_active = TRUE
    RETURNING id, email, name, avatar_url, role, updated_at
  `;

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
}