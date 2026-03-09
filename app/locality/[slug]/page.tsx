import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { POPULAR_LUCKNOW_LOCALITIES } from '@/data/lucknowLocalities';
import LocalityDetailClient from './LocalityDetailClient';
import { Metadata } from 'next';

// Helper to generate slug (must match the one used in page.tsx/client)
const generateSlug = (label: string) => label.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const locality = POPULAR_LUCKNOW_LOCALITIES.find(l => generateSlug(l.label) === slug);

    if (!locality) return { title: 'Locality Not Found | Property Ganj' };

    return {
        title: `Top Properties in ${locality.label}, Lucknow - Buy/Rent | Property Ganj`,
        description: `Explore the best properties for sale and rent in ${locality.label}, Lucknow. ${locality.insights?.pros?.[0] || 'Premium residential and commercial options available.'}`
    }
}

export default async function LocalityPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const locality = POPULAR_LUCKNOW_LOCALITIES.find(l => generateSlug(l.label) === slug);

    if (!locality) {
        notFound();
    }

    const localityNames = [locality.locality, ...(locality.aliases || [])];

    // Fetch properties from Supabase
    // Uses ILIKE for case-insensitive matching. OR logic for aliases
    // localityNames = ['Gomti Nagar', 'GomtiNagar'] -> locality.ilike.%Gomti Nagar%, locality.ilike.%GomtiNagar%
    const orQuery = localityNames.map(name => `locality.ilike.%${name}%`).join(',');

    const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'published')
        .or(orQuery)
        .order('created_at', { ascending: false });

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .or(`location->>locality.ilike.%${locality.locality}%`); // JSONB match for projects location

    const cleanProperties = properties || [];
    const cleanProjects = projects || [];

    // Get nearby localities
    const currentIndex = POPULAR_LUCKNOW_LOCALITIES.indexOf(locality);
    const nearby = POPULAR_LUCKNOW_LOCALITIES
        .filter((_, i) => i !== currentIndex)
        .slice(Math.max(0, currentIndex - 2), currentIndex + 3)
        .slice(0, 4)
        .map(l => ({
            label: l.label,
            slug: generateSlug(l.label),
            priceRange: `₹${(l.insights?.averagePricePerSqft ?? 4000) * 0.5} - ₹${(l.insights?.averagePricePerSqft ?? 8000) * 1.5}`,
            image: '/kanpur-road-locality.jpg' // Placeholder
        }));

    const enrichedLocality = {
        ...locality,
        realStats: {
            count: cleanProperties.length
        },
        image: '/kanpur-road-locality.jpg', // Placeholder
        slug: slug
    };

    // Serialize for Client Component
    const serializedProperties = cleanProperties.map((p: any) => ({
        ...p,
        _id: p.id, // Map Supabase ID to _id for frontend compatibility
        listedBy: p.listed_by,
        projectId: p.project_id,
        specs: {
            // Default specs structure
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            carpetArea: p.carpet_area,
            builtUpArea: p.built_up_area,
            ...p.specs // Merge if specs JSONB exists
        },
        location: {
            city: p.city,
            locality: p.locality,
            address: p.address
        },
        createdAt: p.created_at,
        updatedAt: p.updated_at
    }));

    const serializedProjects = cleanProjects.map((p: any) => ({
        ...p,
        _id: p.id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
    }));

    const serializedOwnerProperties = serializedProperties.filter(p => p.owner_type === 'owner' || p.ownerType === 'owner');

    const allLocalities = POPULAR_LUCKNOW_LOCALITIES.map(l => ({
        label: l.label,
        slug: generateSlug(l.label),
        insights: l.insights
    }));

    return (
        <LocalityDetailClient
            locality={enrichedLocality}
            properties={serializedProperties}
            projects={serializedProjects}
            ownerProperties={serializedOwnerProperties}
            nearbyLocalities={nearby}
            allLocalities={allLocalities}
        />
    );
}
