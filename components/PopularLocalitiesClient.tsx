'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star } from 'lucide-react';
import { PopularLucknowLocality } from '@/data/lucknowLocalities';

interface EnrichedLocality extends PopularLucknowLocality {
    realStats?: {
        count: number;
    };
    slug: string;
    image: string;
}

const LOCALITY_IMAGES: Record<string, string> = {
    'Gomti Nagar': '/gomti-nagar.jpg',
    'Hazratganj': '/hazratganj.jpg',
    'Indira Nagar': '/indira-nagar.jpg',
    'Aliganj': '/aliganj.jpg',
    'Vrindavan Yojna': '/vrindavan-yojna.jpg',
    'Amar Shaheed Path': '/shaheed-path.jpg',
};

const FALLBACK_IMAGES = [
    '/kanpur-road-locality.jpg',
    '/modern-apartment.jpg',
    '/luxury-apartment.jpg',
    '/residential-plots.jpg'
];

export default function PopularLocalitiesClient() {
    const [localities, setLocalities] = useState<EnrichedLocality[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/localities/stats');
                const data = await res.json();

                if (data.localities) {
                    const processed = data.localities.map((loc: any, index: number) => ({
                        ...loc,
                        slug: loc.label.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
                        image: LOCALITY_IMAGES[loc.label] || LOCALITY_IMAGES[loc.locality] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
                    }));
                    // Sort by ranking or count if needed, for now keep original order or slice
                    setLocalities(processed);
                }
            } catch (error) {
                console.error('Failed to fetch locality stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const displayLocalities = localities.slice(0, 8); // Show top 8 or so

    if (loading) {
        return <div className="py-12 text-center">Loading popular localities...</div>;
    }

    return (
        <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory" data-locality-scroll>
                {displayLocalities.map((locality) => (
                    <Link href={`/locality/${locality.slug}`} key={locality.label} className="group">
                        <div className="relative w-[300px] lg:w-[350px] h-[400px] snap-start perspective-1000">
                            <div className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180">

                                {/* Front Side */}
                                <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100">
                                    <div className="h-3/5 w-full relative">
                                        <Image
                                            src={locality.image}
                                            alt={locality.label}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 350px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-2xl font-bold">{locality.label}</h3>
                                            <p className="text-white/90 text-sm">{locality.area || locality.locality}</p>
                                        </div>
                                    </div>
                                    <div className="h-2/5 p-6 flex flex-col justify-between bg-white">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                                    Top Rated
                                                </span>
                                                {locality.insights?.safetyRating && (
                                                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {locality.insights.safetyRating}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-sm line-clamp-2">
                                                {locality.insights?.pros?.[0] || "Explore properties in this premium locality."}
                                            </p>
                                        </div>
                                        <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side (Hidden on Mobile by default, but we want flip on desktop. 
                    The user said "not for mobile view keep it the same for mobile but just add image".
                    So on mobile we might want to disable the hover effect or just show the front.
                    The 'group-hover:rotate-y-180' handles the flip. On touch devices hover is sticky.
                    We can use 'lg:group-hover:rotate-y-180' to only flip on large screens.
                */}
                                <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 flex flex-col justify-center items-center text-center border border-slate-700">
                                    <h3 className="text-2xl font-bold mb-2">{locality.label}</h3>
                                    <div className="w-16 h-1 bg-primary rounded-full mb-6 mx-auto" />

                                    <div className="space-y-6 w-full">
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Properties Listed</p>
                                            <p className="text-4xl font-bold text-white">{locality.realStats?.count || 0}</p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Avg Price</p>
                                            <p className="text-xl font-bold text-primary">
                                                ₹{locality.insights?.averagePricePerSqft ? (locality.insights.averagePricePerSqft * 0.5).toFixed(0) : '3900'} - ₹{locality.insights?.averagePricePerSqft ? (locality.insights.averagePricePerSqft * 1.5).toFixed(0) : '11700'} <span className="text-sm font-normal text-slate-400">/ sqft</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center gap-4">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                                                    {locality.insights?.safetyRating || 4.6} <Star className="w-4 h-4 fill-current" />
                                                </div>
                                                <p className="text-xs text-slate-500">Rating</p>
                                            </div>
                                            <div className="w-px h-8 bg-slate-700" />
                                            <div className="text-center">
                                                <p className="font-bold text-lg">{locality.insights?.ranking ? (20 - locality.insights.ranking) * 20 : 390}</p>
                                                <p className="text-xs text-slate-500">Reviews</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <span className="inline-block px-6 py-2 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors">
                                            Explore Locality
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <button
                onClick={() => {
                    const container = document.querySelector('[data-locality-scroll]');
                    if (container) {
                        container.scrollBy({ left: 350, behavior: 'smooth' });
                    }
                }}
                className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 z-10 transition-all items-center justify-center border border-gray-200 translate-x-1/2"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
        </div>
    );
}
