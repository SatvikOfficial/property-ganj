import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';
import { getAdminStats, getAgents, getProjects } from '../actions';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    // Check Admin Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        notFound();
    }

    // Fetch data using server actions
    const [stats, agents, projects] = await Promise.all([
        getAdminStats(),
        getAgents(),
        getProjects(),
    ]);

    return (
        <AdminDashboardClient
            initialProjects={projects as any[]} // Type casting for simplicity, actions return correct shape
            initialAgents={agents as any[]}
            stats={stats}
        />
    );
}
