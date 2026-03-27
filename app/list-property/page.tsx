import Header from '@/components/header';
import ListPropertyForm from '@/components/listing/ListPropertyForm';
import { createClient } from '@/utils/supabase/server';

export default async function ListPropertyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userData = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone, email')
      .eq('user_id', user.id)
      .maybeSingle();

    userData = {
      name: profile?.full_name || user.user_metadata?.full_name || '',
      phone: profile?.phone || '',
      email: profile?.email || user.email || '',
    };
  }

  return (
    <main className="min-h-screen">
      {/* Dynamic premium background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-moveSlow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-moveSlowDelayed"></div>
      </div>

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
          user={userData}
        />
      </div>
    </main>
  );
}
