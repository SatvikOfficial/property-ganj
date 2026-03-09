import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: builder, error } = await supabase
            .from('builders')
            .select('*')
            .eq('id', params.id)
            .single();
            
        if (error || !builder) {
            return NextResponse.json(
                { error: 'Builder not found' },
                { status: 404 }
            );
        }
        
        // Map to camelCase
        const mapped = {
            _id: builder.id,
            name: builder.name,
            reraId: builder.rera_id,
            logoUrl: builder.logo_url,
            description: builder.description,
            establishedYear: builder.established_year,
            totalProjects: builder.total_projects,
            ongoingProjects: builder.ongoing_projects,
            completedProjects: builder.completed_projects,
            headquarters: builder.headquarters,
            contactEmail: builder.contact_email,
            contactPhone: builder.contact_phone,
            website: builder.website,
            tags: builder.tags,
            createdAt: builder.created_at,
            updatedAt: builder.updated_at
        };
        
        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching builder:', error);
        return NextResponse.json(
            { error: 'Failed to fetch builder' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        
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
            tags: body.tags,
            updated_at: new Date().toISOString()
        };

        const { data: builder, error } = await supabase
            .from('builders')
            .update(dbBody)
            .eq('id', params.id)
            .select()
            .single();
            
        if (error || !builder) {
            return NextResponse.json(
                { error: 'Builder not found or update failed' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(builder);
    } catch (error) {
        console.error('Error updating builder:', error);
        return NextResponse.json(
            { error: 'Failed to update builder' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        
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

        const { error } = await supabase
            .from('builders')
            .delete()
            .eq('id', params.id);
            
        if (error) {
            return NextResponse.json(
                { error: 'Builder not found or delete failed' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ message: 'Builder deleted successfully' });
    } catch (error) {
        console.error('Error deleting builder:', error);
        return NextResponse.json(
            { error: 'Failed to delete builder' },
            { status: 500 }
        );
    }
}
