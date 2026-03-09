import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { POPULAR_LUCKNOW_LOCALITIES } from '@/data/lucknowLocalities';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createClient();

        // Supabase doesn't support complex aggregation like Mongo directly easily without RPC.
        // For now, we'll fetch all published properties properties in Lucknow (lite select)
        // and aggregate in memory. This is okay for < 10k items.
        // Optimization: create a postgres view or RPC function later.

        const { data: properties, error } = await supabase
            .from('properties')
            .select('price, locality, city')
            .eq('status', 'published')
            .ilike('city', '%Lucknow%');

        if (error) throw error;

        // Group by locality
        const statsMap: Record<string, { count: number; sumPrice: number; min: number; max: number }> = {};

        properties?.forEach((p) => {
            if (!p.locality) return;
            const loc = p.locality.trim().toLowerCase();

            if (!statsMap[loc]) {
                statsMap[loc] = { count: 0, sumPrice: 0, min: Infinity, max: -Infinity };
            }

            statsMap[loc].count++;
            statsMap[loc].sumPrice += p.price;
            statsMap[loc].min = Math.min(statsMap[loc].min, p.price);
            statsMap[loc].max = Math.max(statsMap[loc].max, p.price);
        });

        // Map stats back to POPULAR_LUCKNOW_LOCALITIES
        const enrichedLocalities = POPULAR_LUCKNOW_LOCALITIES.map(locality => {
            const locName = locality.locality.toLowerCase();
            const aliases = locality.aliases?.map(a => a.toLowerCase()) || [];

            // Aggregate counts from main name and aliases
            let totalCount = 0;

            // Check main name
            if (statsMap[locName]) totalCount += statsMap[locName].count;

            // Check label if different
            const labelName = locality.label.toLowerCase();
            if (labelName !== locName && statsMap[labelName]) totalCount += statsMap[labelName].count;

            // Check aliases
            aliases.forEach(alias => {
                if (statsMap[alias]) totalCount += statsMap[alias].count;
            });

            return {
                ...locality,
                realStats: {
                    count: totalCount || 0,
                }
            };
        });

        return NextResponse.json({ localities: enrichedLocalities });
    } catch (error: any) {
        console.error('Error fetching locality stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
