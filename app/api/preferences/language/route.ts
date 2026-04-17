import { NextResponse } from 'next/server';

import { LANGUAGE_COOKIE, normalizeLanguage } from '@/lib/i18n';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const language = normalizeLanguage(payload?.language);

  const response = NextResponse.json({ success: true, language });
  response.cookies.set(LANGUAGE_COOKIE, language, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return response;
}