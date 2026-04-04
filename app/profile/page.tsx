import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MailWarning } from 'lucide-react';
import Header from '@/components/header';
import { ProfileClient } from '@/components/profile/ProfileClient';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const isEmailUnverified = user.email && !user.email_confirmed_at;

  const profileUser = {
    id: user.id,
    name: profile?.full_name || '',
    email: user.email || '',
    phone: profile?.phone || '',
    role: profile?.role || 'user',
    avatar_url: profile?.avatar_url || null,
    created_at: profile?.created_at,
  };

  const dashboardHref =
    profile?.role === 'admin'
      ? '/admin'
      : profile?.role === 'agent'
        ? '/agent'
        : profile?.role === 'builder'
          ? '/builder-dashboard'
          : null;

  const dashboardLabel =
    profile?.role === 'admin'
      ? 'Admin Dashboard'
      : profile?.role === 'agent'
        ? 'Agent Dashboard'
        : profile?.role === 'builder'
          ? 'Builder Dashboard'
          : null;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        </div>
        
        {isEmailUnverified && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded-md flex items-center gap-3 shadow-sm">
            <MailWarning className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium text-sm md:text-base">
              Your email ({user.email}) is not verified. Please check your inbox for a verification link to ensure full account recovery options.
            </p>
          </div>
        )}

        <ProfileClient user={profileUser} />
      </div>
    </main>
  );
}
