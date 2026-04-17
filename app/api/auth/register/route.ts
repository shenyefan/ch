import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, signToken, AUTH_COOKIE_OPTIONS, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name } = body ?? {};

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'email, password and name are required' }, { status: 400 });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const password_hash = await hashPassword(password);
  const [user] = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email.toLowerCase()}, ${password_hash}, ${name.trim()})
    RETURNING id, email, name, role
  `;

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });

  const response = NextResponse.json(
    { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    { status: 201 }
  );
  response.cookies.set(COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
  return response;
}
