'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, IndianRupee } from 'lucide-react';

interface Project {
    _id: string;
    name: string;
    status: string;
    location: {
        locality?: string;
        city: string;
    };
    priceRange: {
        min: number;
        max: number;
    };
    coverImage?: string;
    builderId?: {
        name: string;
    };
}

export default function PopularProjectsClient() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch('/api/projects?limit=6');
                const data = await res.json();

                if (res.ok) {
                    setProjects(data.projects || []);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="h-80 bg-muted rounded-2xl animate-pulse"
                    />
                ))}
            </>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No projects available yet.</p>
            </div>
        );
    }

    return (
        <>
            {projects.map((project) => (
                <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-blue-100 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                    {project.coverImage ? (
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={project.coverImage || "/apartment-complex.jpg"}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {project.status}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-xs font-bold text-blue-600">{project.status}</p>
                            </div>
                        </div>
                    )}

                    <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h3>

                        <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            {project.location.locality && `${project.location.locality}, `}
                            {project.location.city}
                        </p>

                        <div className="flex items-center gap-1 text-blue-600 font-bold">
                            <IndianRupee className="w-4 h-4" />
                            <span className="text-sm">
                                {formatPrice(project.priceRange.min)} - {formatPrice(project.priceRange.max)}
                            </span>
                        </div>

                        {project.builderId?.name && (
                            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-blue-100">
                                by {project.builderId.name}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </>
    );
}
