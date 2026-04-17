import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

/**
 * PATCH /api/admin/users/[id]  — 启用/禁用账号或修改角色
 * Body: { is_active?: boolean, role?: 'user' | 'admin' }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }
  // 不允许管理员修改自己的角色/状态
  if (userId === auth.userId) {
    return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active;
  if (body.role === 'user' || body.role === 'admin') updates.role = body.role;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  // 动态构建 SET 子句
  const setEntries = Object.entries(updates);

  let result;
  if (setEntries.length === 1 && 'is_active' in updates) {
    [result] = await sql`
      UPDATE users SET is_active = ${updates.is_active as boolean}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, role, is_active
    `;
  } else if (setEntries.length === 1 && 'role' in updates) {
    [result] = await sql`
      UPDATE users SET role = ${updates.role as string}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, role, is_active
    `;
  } else {
    [result] = await sql`
      UPDATE users SET
        is_active = ${updates.is_active as boolean},
        role = ${updates.role as string},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, name, role, is_active
    `;
  }

  if (!result) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user: result });
}

/**
 * DELETE /api/admin/users/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (auth.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }
  if (userId === auth.userId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const [deleted] = await sql`
    DELETE FROM users WHERE id = ${userId} RETURNING id
  `;
  if (!deleted) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ message: 'User deleted' });
}
