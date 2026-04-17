import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [users, cities, landmarks, reviews, features, chapters] = await Promise.all([
    sql`SELECT COUNT(*)::int AS total FROM users`,
    sql`SELECT COUNT(*)::int AS total FROM cities`,
    sql`SELECT COUNT(*)::int AS total FROM landmarks`,
    sql`SELECT COUNT(*)::int AS total FROM reviews`,
    sql`SELECT COUNT(*)::int AS total FROM city_features`,
    sql`SELECT COUNT(*)::int AS total FROM feature_chapters`,
  ]);

  return NextResponse.json({
    totals: {
      users: users[0]?.total ?? 0,
      cities: cities[0]?.total ?? 0,
      landmarks: landmarks[0]?.total ?? 0,
      reviews: reviews[0]?.total ?? 0,
      features: features[0]?.total ?? 0,
      chapters: chapters[0]?.total ?? 0,
    },
  });
}