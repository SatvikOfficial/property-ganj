'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Project {
    _id: string;
    name: string;
    location: {
        locality: string;
        city: string;
    };
    minPrice: number;
    maxPrice: number;
    coverImage?: string;
    status: string;
    category: string;
    builderId?: {
        name: string;
    };
}

export default function PremiumProjectsClient() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                // Fetch premium/featured projects. For now, just fetching latest 9.
                // In a real app, you might filter by 'featured=true' query param.
                const res = await fetch('/api/projects?limit=9');
                const data = await res.json();

                if (res.ok) {
                    setProjects(data || []);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="h-64 bg-blue-50/50 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12 bg-blue-50/30 rounded-2xl">
                <p className="text-blue-800/60">No premium projects listed yet.</p>
            </div>
        );
    }

    return (
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
            {projects.slice(0, 6).map((project) => (
                <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white hover:shadow-xl transition-all duration-300 border border-blue-100 min-w-[280px] md:min-w-0 snap-center flex-shrink-0 mr-4 md:mr-0"
                >
                    <div className="aspect-[4/3] relative overflow-hidden bg-blue-50">
                        {project.coverImage ? (
                            <img
                                src={project.coverImage}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-blue-200" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute top-3 right-3">
                            <Badge className="bg-white/90 text-blue-900 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                                {project.status}
                            </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wider">
                                {project.category}
                            </p>
                            <h3 className="text-xl font-bold mb-1 leading-tight">{project.name}</h3>
                            <div className="flex items-center text-gray-300 text-sm mb-3">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {project.location.locality}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                <div>
                                    <p className="text-xs text-gray-300">Starting from</p>
                                    <p className="font-bold text-lg">₹{(project.minPrice / 100000).toFixed(1)}L</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-blue-900 transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
