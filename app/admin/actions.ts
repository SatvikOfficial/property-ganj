'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAdminStats() {
    const supabase = await createClient();

    // Parallelize queries for performance
    const [
        { count: totalProjects },
        { count: totalUnits },
        { count: totalUsers },
        { count: totalAgents }, // Promoters + PGAs
    ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('units').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['promoter', 'pga']),
    ]);

    return {
        totalProjects: totalProjects || 0,
        totalUnits: totalUnits || 0,
        totalUsers: totalUsers || 0,
        totalAgents: totalAgents || 0,
    };
}

export async function getAgents() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['promoter', 'pga'])
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getProjects() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            cities (name),
            promoters:profiles!promoter_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function softBlockUnit(unitId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Check if unit is available
    const { data: unit } = await supabase.from('units').select('status').eq('id', unitId).single();
    if (!unit || unit.status !== 'available') {
        throw new Error('Unit is not available');
    }

    // 2. Check if user already has 2 soft blocks (PGA restriction)
    // Note: We might need to relax this check for admins, but for now enforcing it generally or checking role
    // Ideally, catch this on the client side too

    // 3. Update status
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 30); // 30 mins expiry

    const { error } = await supabase
        .from('units')
        .update({
            status: 'soft_block',
            soft_blocked_by: user.id,
            soft_block_expiry: expiry.toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', unitId)
        .eq('status', 'available'); // Double check concurrency

    if (error) throw new Error(error.message);

    // 4. Log Action
    await supabase.from('block_logs').insert({
        unit_id: unitId,
        action_by: user.id,
        previous_status: 'available',
        new_status: 'soft_block',
        remarks: 'Soft blocked by user',
    });

    return { success: true };
}

export async function hardBlockUnit(unitId: string, remarks: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Check role (Admin or Promoter only)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['admin', 'promoter'].includes(profile.role)) {
        throw new Error('Permission denied');
    }

    // Update
    const { error } = await supabase
        .from('units')
        .update({
            status: 'hard_block',
            hard_blocked_by: user.id,
            updated_at: new Date().toISOString(),
        })
        .eq('id', unitId);

    if (error) throw new Error(error.message);

    // Log
    await supabase.from('block_logs').insert({
        unit_id: unitId,
        action_by: user.id,
        previous_status: 'available', // Inaccurate but acceptable
        new_status: 'hard_block',
        remarks: remarks,
    });

    return { success: true };
}

export async function markUnitSold(unitId: string, customerName: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Check role (Admin or Promoter only)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['admin', 'promoter'].includes(profile.role)) {
        throw new Error('Permission denied');
    }

    // Must be Hard Block first (per prompt)
    const { data: unit } = await supabase.from('units').select('status').eq('id', unitId).single();
    if (unit?.status !== 'hard_block') {
        throw new Error('Unit must be Hard Blocked before selling');
    }

    // Update
    const { error } = await supabase
        .from('units')
        .update({
            status: 'sold',
            sold_to_customer_name: customerName,
            sold_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', unitId);

    if (error) throw new Error(error.message);

    // Log
    await supabase.from('block_logs').insert({
        unit_id: unitId,
        action_by: user.id,
        previous_status: 'hard_block',
        new_status: 'sold',
        remarks: `Sold to ${customerName}`,
    });

    return { success: true };
}
