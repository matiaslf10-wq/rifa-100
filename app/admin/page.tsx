import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPanel from '@/components/AdminPanel';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === '1';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return <AdminPanel />;
}
