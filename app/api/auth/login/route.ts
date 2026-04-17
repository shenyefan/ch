import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_OPTIONS, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
  }

  const [user] = await sql`
    SELECT id, email, name, role, password_hash, is_active
    FROM users
    WHERE email = ${String(email).toLowerCase()}
  `;

  if (!user || !(await verifyPassword(String(password), user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  if (!user.is_active) {
    return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
  }

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  response.cookies.set(COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
  return response;
}
