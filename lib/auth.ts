import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// ──────────────────────────────────────
// 常量
// ──────────────────────────────────────
export const COOKIE_NAME = 'ch_auth';
const BCRYPT_ROUNDS = 12;
const TOKEN_TTL = '7d';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return new TextEncoder().encode(secret);
}

// ──────────────────────────────────────
// Token payload type
// ──────────────────────────────────────
export interface TokenPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}

// ──────────────────────────────────────
// JWT helpers
// ──────────────────────────────────────
export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────
// Cookie helpers (Server Components / Route Handlers)
// ──────────────────────────────────────
export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** 从 Request 的 Authorization header 或 cookie 中获取用户（兼容两种方式） */
export async function getAuthUserFromRequest(req: NextRequest): Promise<TokenPayload | null> {
  // 优先 Bearer token
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return verifyToken(authHeader.slice(7));
  }
  // 降级到 cookie
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ──────────────────────────────────────
// Password helpers
// ──────────────────────────────────────
export function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return compare(password, hashed);
}

// ──────────────────────────────────────
// Cookie 配置（统一管理）
// ──────────────────────────────────────
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 天
};
