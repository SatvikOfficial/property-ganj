import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isFeaturedAddressLine2, isPropertyGanjAddressLine2 } from '@/lib/property-ganj';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let admin;
  try {
    admin = createAdminClient();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Admin client misconfigured' }, { status: 500 });
  }

  const [
    { data: allProfiles, error: profErr },
    { data: allProps, error: propErr },
  ] = await Promise.all([
    admin.from('profiles').select('*').order('created_at', { ascending: false }),
    admin.from('properties').select('*').order('created_at', { ascending: false }),
  ]);

  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 });
  if (propErr) return NextResponse.json({ error: propErr.message }, { status: 500 });

  const featuredProps = (allProps || []).filter((property: any) =>
    isFeaturedAddressLine2(property.address_line2) || isPropertyGanjAddressLine2(property.address_line2),
  );

  const applications = (allProfiles || []).filter((p: any) => {
    const raw = p.company_name;
    return typeof raw === 'string' && raw.includes('"status":"agent_application"');
  });

  return NextResponse.json({
    profiles: allProfiles || [],
    properties: allProps || [],
    featured: featuredProps || [],
    agentApplications: applications,
  });
}
