'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Calendar } from 'lucide-react';

interface Builder {
    _id: string;
    name: string;
    logoUrl?: string;
    establishedYear?: number;
    headquarters?: {
        city?: string;
    };
}

export default function FeaturedBuildersClient() {
    const [builders, setBuilders] = useState<Builder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBuilders() {
            try {
                // Try fetching from API first
                const res = await fetch('/api/builders?limit=6');
                const data = await res.json();

                if (res.ok && data.builders && data.builders.length > 0) {
                    setBuilders(data.builders);
                } else {
                    // Fallback to sample data if API returns empty
                    // This ensures builders are always visible even if DB is empty
                    const { SAMPLE_BUILDERS } = await import('@/data/sampleBuilders');
                    // Map sample data to match Builder interface
                    const mappedBuilders = SAMPLE_BUILDERS.map((b: any, index: number) => ({
                        _id: `sample-${index}`,
                        name: b.name,
                        logoUrl: b.logoUrl,
                        establishedYear: b.establishedYear,
                        headquarters: b.headquarters
                    }));
                    setBuilders(mappedBuilders);
                }
            } catch (error) {
                console.error('Error fetching builders:', error);
                // Fallback on error
                const { SAMPLE_BUILDERS } = await import('@/data/sampleBuilders');
                const mappedBuilders = SAMPLE_BUILDERS.map((b: any, index: number) => ({
                    _id: `sample-${index}`,
                    name: b.name,
                    logoUrl: b.logoUrl,
                    establishedYear: b.establishedYear,
                    headquarters: b.headquarters
                }));
                setBuilders(mappedBuilders);
            } finally {
                setLoading(false);
            }
        }

        fetchBuilders();
    }, []);

    if (loading) {
        return (
            <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="min-w-[300px] lg:min-w-[350px] h-48 bg-muted rounded-2xl animate-pulse snap-start"
                    />
                ))}
            </>
        );
    }

    if (builders.length === 0) {
        return (
            <div className="min-w-full text-center py-12">
                <p className="text-muted-foreground">No builders available yet.</p>
            </div>
        );
    }

    return (
        <>
            {builders.map((builder, index) => (
                <Link
                    key={builder._id}
                    href={`/builders/${builder._id}`}
                    className="relative min-w-[280px] lg:min-w-[320px] snap-start group flex-shrink-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                    <div className="relative h-full bg-slate-50/80 border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 p-2 flex items-center justify-center group-hover:shadow-md transition-all">
                                    {builder.logoUrl ? (
                                        <img
                                            src={builder.logoUrl}
                                            alt={builder.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-primary/40" />
                                    )}
                                </div>
                                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                    Trusted
                                </div>
                            </div>

                            <h3 className="font-bold text-foreground text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                {builder.name}
                            </h3>

                            {builder.headquarters?.city && (
                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {builder.headquarters.city}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                            {builder.establishedYear ? (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Est.</span>
                                    <span className="text-sm font-medium text-foreground">{builder.establishedYear}</span>
                                </div>
                            ) : (
                                <div />
                            )}

                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <span className="text-lg leading-none mb-0.5">→</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}
