'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Property {
    _id: string;
    title: string;
    price: number;
    location: {
        locality?: string;
        city: string;
    };
    specs?: {
        bedrooms?: number;
        carpetArea?: number;
        builtUpArea?: number;
    };
    propertyType: string;
    purpose: 'sale' | 'rent';
    media: {
        photos: Array<{ url: string }>;
    };
}

interface RecommendedPropertiesProps {
    title?: string;
    className?: string;
    excludeIds?: string[];
    limit?: number;
}

import { getRecommendedProperties } from '@/lib/recommendations';

export default function RecommendedProperties({
    title = 'Recommended For You',
    className = '',
    excludeIds = [],
    limit = 6,
}: RecommendedPropertiesProps) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Memoize excludeIds to prevent unnecessary re-fetches
    const excludeIdsKey = useMemo(() => excludeIds.join(','), [excludeIds]);

    useEffect(() => {
        let isMounted = true;

        async function fetchRecommendations() {
            try {
                const recommended = await getRecommendedProperties(limit, excludeIds);

                if (isMounted) {
                    setProperties(recommended as unknown as Property[]);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                // Fallback: fetch recent properties if recommendations fail
                try {
                    const res = await fetch(`/api/properties?limit=${limit}&status=published`);
                    const data = await res.json();
                    if (res.ok && data.properties && isMounted) {
                        setProperties(data.properties);
                    }
                } catch (fallbackError) {
                    console.error('Fallback fetch also failed:', fallbackError);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchRecommendations();

        return () => {
            isMounted = false;
        };
    }, [excludeIdsKey, limit]);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <section className={`bg-background py-6 md:py-12 px-4 ${className}`}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6">
                        {title}
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="min-w-[280px] lg:min-w-[320px] h-80 bg-muted rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (properties.length === 0) {
        return null;
    }

    return (
        <section className={`bg-background py-6 md:py-12 px-4 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                        {title}
                    </h2>
                    <Link
                        href="/search"
                        className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base lg:text-lg flex items-center gap-1"
                    >
                        See all
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
                    {properties.map((property) => {
                        const bhk = property.specs?.bedrooms
                            ? `${property.specs.bedrooms} BHK ${property.propertyType}`
                            : property.propertyType;
                        const sqft =
                            property.specs?.carpetArea || property.specs?.builtUpArea || 0;
                        const location = [property.location?.locality, property.location?.city]
                            .filter(Boolean)
                            .join(', ');

                        return (
                            <Link
                                key={property._id}
                                href={`/property/${property._id}`}
                                className="min-w-[280px] snap-start flex-shrink-0 lg:min-w-[320px]"
                            >
                                <div className="card-premium cursor-pointer group overflow-hidden">
                                    <div className="relative mb-3 bg-muted rounded-t-2xl overflow-hidden h-52 md:h-60 lg:h-64 image-overlay">
                                        <img
                                            src={
                                                property.media?.photos?.[0]?.url && !property.media.photos[0].url.includes('/properties/sample-')
                                                    ? property.media.photos[0].url
                                                    : '/modern-apartment.jpg' // Fallback for broken seed images
                                            }
                                            alt={bhk}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                            </svg>
                                            {property.media?.photos?.length || 0}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-muted-foreground font-semibold mb-2 text-sm md:text-base">
                                            {bhk}
                                        </p>
                                        <p className="text-foreground font-bold text-lg md:text-xl mb-1">
                                            {formatPrice(property.price)}
                                        </p>
                                        {sqft > 0 && (
                                            <p className="text-muted-foreground text-sm md:text-base mb-2">
                                                {sqft} sqft
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            {location}
                                        </p>
                                        <p className="text-xs md:text-sm text-primary font-medium">
                                            {property.purpose === 'rent' ? 'Available for Rent' : 'Available'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
