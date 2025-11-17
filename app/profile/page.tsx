import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';
import { ProfileClient } from '@/components/profile/ProfileClient';

export default async function ProfilePage() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);

  if (!payload) {
    redirect('/auth');
  }

  const user = await User.findById(payload.userId).select(
    'name email phone createdAt updatedAt'
  );

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f5f1] to-[#fce7cf] px-4 py-12">
      <ProfileClient
        user={{
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
        }}
      />
    </div>
  );
}

