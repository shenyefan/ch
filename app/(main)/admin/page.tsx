import { redirect } from 'next/navigation';

import { getAuthUser } from '@/lib/auth';

import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const auth = await getAuthUser();

  if (!auth) {
    redirect('/login');
  }

  if (auth.role !== 'admin') {
    redirect('/account');
  }

  return <AdminDashboardClient currentUserId={auth.userId} currentUserName={auth.email} />;
}