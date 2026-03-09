'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Define Interface matching what frontend expects (roughly IProperty)
interface RecommendedProperty {
    _id: string;
    specs: {
        bedrooms?: number;
        bathrooms?: number;
        carpetArea?: number;
    };
    propertyType: string;
    price: number;
    purpose: string;
    location: {
        locality: string;
        city: string;
    };
    media: {
        photos: { url: string }[];
    };
    [key: string]: any;
}

export async function getRecommendedProperties(limit: number = 6, excludeIds: string[] = []): Promise<RecommendedProperty[]> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        let recommended: any[] = [];
        const popularLocalities = ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj'];

        // 1. If user is logged in, try to get recommendations based on liked properties
        if (user) {
            // Fetch liked properties
            const { data: likes } = await supabase
                .from('likes')
                .select('property_id, properties(*)')
                .eq('user_id', user.id);

            if (likes && likes.length > 0) {
                // Extract preferences
                // likes is [{ property_id, properties: {...} }]
                const likedProps = likes.map(l => l.properties).filter(Boolean);
                const localities = [...new Set(likedProps.map((p: any) => p.locality).filter(Boolean))];
                const types = [...new Set(likedProps.map((p: any) => p.property_type))];

                // Supabase doesn't support sophisticated OR across fields easily in one line like Mongo $or
                // We'll prioritize locality match first, then type

                let query = supabase.from('properties')
                    .select('*')
                    .eq('status', 'published')
                    .not('id', 'in', `(${likedProps.map((p: any) => p.id).join(',')})`);

                if (localities.length > 0) {
                    // ilike any of localities
                    const locQuery = localities.map(l => `locality.ilike.%${l}%`).join(',');
                    query = query.or(locQuery);
                }

                const { data: recs } = await query.limit(limit);
                if (recs) recommended = recs;
            }
        }

        // 2. Fallback to popular localities
        if (recommended.length === 0) {
            const locQuery = popularLocalities.map(l => `locality.ilike.%${l}%`).join(',');
            const { data: recs } = await supabase
                .from('properties')
                .select('*')
                .eq('status', 'published')
                .or(locQuery)
                .limit(limit)
                .order('created_at', { ascending: false });

            if (recs) recommended = recs;
        }

        // 3. Fallback to any recent
        if (recommended.length < 3) {
            const existingIds = recommended.map(p => p.id);
            let query = supabase.from('properties')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(limit - recommended.length);

            if (existingIds.length > 0) {
                query = query.not('id', 'in', `(${existingIds.join(',')})`);
            }

            const { data: fallback } = await query;
            if (fallback) recommended = [...recommended, ...fallback];
        }

        // Map to frontend format
        return recommended.map(p => ({
            _id: p.id,
            title: p.title,
            specs: {
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                carpetArea: p.carpet_area,
                builtUpArea: p.built_up_area,
                areaUnit: p.area_unit
            },
            propertyType: p.property_type,
            price: p.price,
            purpose: p.purpose,
            location: {
                locality: p.locality,
                city: p.city,
                address: p.address
            },
            media: {
                photos: p.images ? p.images.map((url: string) => ({ url })) : []
            },
            coverImage: p.images?.[0], // helper
            isLiked: false // handled by client usually
        }));

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}
