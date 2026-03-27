/**
 * Supabase database types for PropertyGanj.
 * These replace the old Mongoose model types.
 */

// ─── Properties ──────────────────────────────────────────────

export interface DbProperty {
    id: string;
    pg_id?: string;
    title: string;
    description?: string;
    property_type: string;
    bhk?: string;
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    furnishing?: string;
    built_up_area_sqft?: number;
    carpet_area_sqft?: number;
    price?: number;
    rent?: number;
    maintenance?: number;
    deposit?: number;
    for_sale?: boolean;
    for_rent?: boolean;
    address_line1?: string;
    formatted_address?: string;
    locality?: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
    photos?: string[];
    status?: string;
    owner_user_id?: string;
    hold_by_user_id?: string | null;
    hold_expires_at?: string | null;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    amenities?: string[];
    highlights?: string[];
    tags?: string[];
    created_at?: string;
    updated_at?: string;
}

// ─── Profiles ───────────────────────────────────────────────

export interface DbProfile {
    id: string;
    user_id?: string;
    full_name?: string;
    phone?: string;
    email?: string;
    role?: string;
    avatar_url?: string;
    agent_id?: string;
    agent_experience?: number;
    agent_specialization?: string[];
    agent_languages?: string[];
    agent_bio?: string;
    agent_location?: string;
    agent_is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

// ─── Likes ──────────────────────────────────────────────────

export interface DbLike {
    id: string;
    user_id: string;
    property_id: string;
    created_at?: string;
}

// ─── Leads ──────────────────────────────────────────────────

export interface DbLead {
    id: string;
    name: string;
    email?: string;
    phone: string;
    message?: string;
    property_id?: string;
    agent_id?: string;
    status?: string;
    created_at?: string;
}

// ─── Property Images ────────────────────────────────────────

export interface DbPropertyImage {
    id: string;
    property_id: string;
    url: string;
    category?: string;
    public_id?: string;
    label?: string;
    sort_order?: number;
    created_at?: string;
}

// ─── Property Floorplans ────────────────────────────────────

export interface DbPropertyFloorplan {
    id: string;
    property_id: string;
    url: string;
    label?: string;
    sort_order?: number;
    created_at?: string;
}

// ─── User Interactions (tracking) ───────────────────────────

export interface DbUserInteraction {
    id: string;
    user_id?: string;
    session_id?: string;
    interaction_type: string; // 'view' | 'click' | 'like' | 'search' | 'filter'
    property_id?: string;
    search_query?: string;
    filters?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    created_at?: string;
}

// ─── Frontend-facing types ──────────────────────────────────

/** Property data as consumed by frontend components */
export interface Property {
    id: string;
    title: string;
    description?: string;
    price?: number;
    purpose: 'sale' | 'rent';
    propertyType: string;
    location: {
        city?: string;
        locality?: string;
        area?: string;
        sector?: string;
        block?: string;
        road?: string;
        address?: string;
        landmark?: string;
        pincode?: string;
        latitude?: number;
        longitude?: number;
    };
    specs: {
        bedrooms?: number;
        bathrooms?: number;
        balconies?: number;
        parking?: number;
        carpetArea?: number;
        builtUpArea?: number;
        plotArea?: number;
        areaUnit?: string;
        furnishing?: string;
        floorNo?: number;
        totalFloors?: number;
        age?: string;
        facing?: string;
    };
    amenities: string[];
    highlights: string[];
    media: {
        photos: { url: string; category?: string; label?: string }[];
        videoUrl?: string;
    };
    contact?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    currency?: string;
    status?: string;
    listedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ─── Mapper: DB row → frontend Property ─────────────────────

export function mapDbPropertyToFrontend(p: DbProperty): Property {
    return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.for_rent ? p.rent : p.price,
        purpose: p.for_rent ? 'rent' : 'sale',
        propertyType: p.property_type || '',
        location: {
            city: p.city,
            locality: p.locality,
            address: p.formatted_address || p.address_line1,
            latitude: p.lat,
            longitude: p.lng,
        },
        specs: {
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            carpetArea: p.carpet_area_sqft,
            builtUpArea: p.built_up_area_sqft,
            parking: p.parking,
            furnishing: p.furnishing,
            areaUnit: 'sqft',
        },
        amenities: p.amenities || [],
        highlights: p.highlights || [],
        media: {
            photos: (p.photos || []).map((url: string) => ({ url })),
        },
        contact: {
            name: p.contact_name,
            phone: p.contact_phone,
            email: p.contact_email,
        },
        currency: 'INR',
        status: p.status,
        listedBy: p.owner_user_id,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
    };
}
