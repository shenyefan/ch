import { redirect } from 'next/navigation';

import { getAuthUser } from '@/lib/auth';

import AccountClient from './AccountClient';

export default async function AccountPage() {
  const auth = await getAuthUser();

  if (!auth) {
    redirect('/login');
  }

  return <AccountClient isAdmin={auth.role === 'admin'} />;
}