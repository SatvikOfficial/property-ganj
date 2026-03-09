import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: project, error } = await supabase
            .from('projects')
            .select('*, builders(*)')
            .eq('id', params.id)
            .single();
            
        if (error || !project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }
        
        const mapped = {
            _id: project.id,
            name: project.name,
            reraId: project.rera_id,
            builderId: project.builders 
                ? { _id: project.builders.id, name: project.builders.name, logoUrl: project.builders.logo_url }
                : null,
            location: project.location || { locality: project.address || '', city: 'Lucknow' },
            description: project.description,
            category: project.category,
            minPrice: project.min_price,
            maxPrice: project.max_price,
            totalUnits: project.total_units,
            status: project.status,
            coverImage: project.cover_image || project.image_url,
            gallery: project.gallery,
            amenities: project.amenities,
            possessionDate: project.possession_date,
            createdAt: project.created_at,
            updatedAt: project.updated_at
        };
        
        return NextResponse.json(mapped);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
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

        // Map camelCase to snake_case
        const dbBody = {
            builder_id: body.builderId,
            name: body.name,
            rera_id: body.reraId,
            location: body.location,
            description: body.description,
            category: body.category,
            min_price: body.minPrice,
            max_price: body.maxPrice,
            total_units: body.totalUnits,
            status: body.status,
            cover_image: body.coverImage,
            gallery: body.gallery,
            amenities: body.amenities,
            possession_date: body.possessionDate,
            updated_at: new Date().toISOString()
        };

        const { data: project, error } = await supabase
            .from('projects')
            .update(dbBody)
            .eq('id', params.id)
            .select()
            .single();
            
        if (error || !project) {
            return NextResponse.json(
                { error: 'Project not found or update failed' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
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
            .from('projects')
            .delete()
            .eq('id', params.id);
            
        if (error) {
            return NextResponse.json(
                { error: 'Project not found or delete failed' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
