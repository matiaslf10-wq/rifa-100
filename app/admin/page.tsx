import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  const isAdmin = cookies().get('admin_auth')?.value === '1';
  if (!isAdmin) redirect('/admin/login');

  return <AdminPanel />;
}
