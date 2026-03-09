import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const builderId = searchParams.get('builderId');
        // const featured = searchParams.get('featured'); // Not used in filtering yet

        let query = supabase.from('projects').select('*, builders(*)').order('created_at', { ascending: false });

        if (builderId) {
            query = query.eq('builder_id', builderId);
        }

        const { data: projects, error } = await query;

        if (error) throw error;

        const mappedProjects = projects?.map(p => ({
            _id: p.id,
            name: p.name,
            reraId: p.rera_id,
            location: p.location || { locality: p.address || '', city: 'Lucknow' }, // Fallback
            description: p.description,
            category: p.category,
            minPrice: p.min_price,
            maxPrice: p.max_price,
            totalUnits: p.total_units,
            status: p.status,
            coverImage: p.cover_image || p.image_url,
            gallery: p.gallery,
            amenities: p.amenities,
            possessionDate: p.possession_date,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            builderId: p.builders // Supabase returns the joined object here
                ? {
                    _id: p.builders.id,
                    name: p.builders.name,
                    logoUrl: p.builders.logo_url,
                    // Add other fields if needed by frontend
                }
                : null
        }));

        return NextResponse.json(mappedProjects);
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        // Check auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 });
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await request.json();

        // Map camelCase to snake_case
        const dbBody = {
            builder_id: body.builderId,
            name: body.name,
            rera_id: body.reraId,
            location: body.location, // jsonb
            description: body.description,
            category: body.category,
            min_price: body.minPrice,
            max_price: body.maxPrice,
            total_units: body.totalUnits,
            status: body.status,
            cover_image: body.coverImage,
            gallery: body.gallery,
            amenities: body.amenities,
            possession_date: body.possessionDate
        };

        const { data, error } = await supabase.from('projects').insert(dbBody).select().single();
        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
