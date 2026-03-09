import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: builders, error } = await supabase
            .from('builders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map snake_case to camelCase for frontend compatibility if needed
        // But for now, returning as is (frontend might need slight adjustment or we map here)
        // Let's map strict camelCase to minimal disruption
        const mappedBuilders = builders?.map(b => ({
            _id: b.id,
            name: b.name,
            reraId: b.rera_id,
            logoUrl: b.logo_url,
            description: b.description,
            establishedYear: b.established_year,
            totalProjects: b.total_projects,
            ongoingProjects: b.ongoing_projects,
            completedProjects: b.completed_projects,
            headquarters: b.headquarters, // jsonb is already object
            contactEmail: b.contact_email,
            contactPhone: b.contact_phone,
            website: b.website,
            tags: b.tags,
            createdAt: b.created_at,
            updatedAt: b.updated_at
        }));

        return NextResponse.json(mappedBuilders);
    } catch (error: any) {
        console.error('Error fetching builders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch builders' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        
        // Check auth - must be logged in
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

        // Map camelCase body to snake_case db
        const dbBody = {
            name: body.name,
            rera_id: body.reraId,
            logo_url: body.logoUrl,
            description: body.description,
            established_year: body.establishedYear,
            total_projects: body.totalProjects,
            ongoing_projects: body.ongoingProjects,
            completed_projects: body.completedProjects,
            headquarters: body.headquarters,
            contact_email: body.contactEmail,
            contact_phone: body.contactPhone,
            website: body.website,
            tags: body.tags
        };

        const { data, error } = await supabase.from('builders').insert(dbBody).select().single();
        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error creating builder:', error);
        return NextResponse.json(
            { error: 'Failed to create builder' },
            { status: 500 }
        );
    }
}
