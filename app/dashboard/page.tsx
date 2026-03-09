import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);

  if (!payload) {
    redirect('/auth');
  }

  await connectDB();
  const user = await User.findById(payload.userId);

  if (!user) {
    redirect('/auth');
  }

  // Route to role-specific dashboard
  switch (user.role) {
    case 'admin':
      redirect('/admin/dashboard');
    case 'agent':
      redirect('/agent/dashboard');
    case 'builder':
      redirect('/builder/dashboard');
    case 'user':
    default:
      redirect('/user/dashboard');
  }
}
