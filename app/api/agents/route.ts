import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: dbAgents, error } = await admin
      .from('profiles')
      .select('*')
      .eq('role', 'agent');

    if (error) {
      throw error;
    }

    const agents = (dbAgents || []).map((agent: any) => ({
      user_id: agent.user_id,
      full_name: agent.full_name,
      company_name: agent.company_name,
      city: agent.city,
      avatar_url: agent.avatar_url,
      created_at: agent.created_at,
      role: agent.role,
      agent_bio: agent.agent_bio || null,
    }));

    return NextResponse.json({ agents });
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: error?.message || 'Unable to fetch agents' }, { status: 500 });
  }
}
