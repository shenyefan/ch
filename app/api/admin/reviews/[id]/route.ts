import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

/**
 * PATCH /api/admin/reviews/[id]
 * Body: { status: 'approved' | 'rejected' | 'pending' }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId < 1) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 });
  }

  const body = await req.json();
  const { status } = body ?? {};
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json(
      { error: 'status must be pending, approved, or rejected' },
      { status: 400 }
    );
  }

  const [review] = await sql`
    UPDATE reviews
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${reviewId}
    RETURNING id, author_name, status, updated_at
  `;

  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  return NextResponse.json({ review });
}

/**
 * DELETE /api/admin/reviews/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId < 1) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 });
  }

  const [deleted] = await sql`
    DELETE FROM reviews WHERE id = ${reviewId} RETURNING id
  `;
  if (!deleted) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

  return NextResponse.json({ message: 'Review deleted' });
}
