import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Header from '@/components/header';
import ListPropertyForm from '@/components/listing/ListPropertyForm';
import connectDB from '@/lib/db';
import { verifyAuthToken } from '@/lib/auth';
import User from '@/models/User';

export default async function ListPropertyPage() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);

  if (!payload) {
    redirect('/auth');
  }

  const user = await User.findById(payload.userId).select('name phone email');

  if (!user) {
    redirect('/auth');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fdf8f5] to-[#fefefe]">
      <Header />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[#9ca3af]">Post Property</p>
          <h1 className="mt-2 text-4xl font-black text-[#1f2a2e]">List your property for free</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Upload details, photos, and videos — reach 1000s of verified buyers and tenants.
          </p>
        </div>

        <ListPropertyForm
          user={{
            name: user.name,
            phone: user.phone,
            email: user.email,
          }}
        />
      </div>
    </main>
  );
}
