import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin } from 'lucide-react';

import Header from '@/components/header';
import { ChevronLeft } from 'lucide-react';

async function getProjects() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('projects')
        .select('*, areas(name), cities(name)')
        .order('created_at', { ascending: false });
    
    if (!data) return [];
    
    return data.map(project => ({
        ...project,
        _id: project.id,
        builderName: project.builder_name,
        reraId: project.rera_number,
        location: {
            locality: project.areas?.name,
            city: project.cities?.name,
        }
    }));
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold">Premium Projects in Lucknow</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                        <Link href={`/projects/${project._id}`} key={project._id}>
                            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                                <div className="relative h-56 w-full bg-gray-200">
                                    {project.image_url ? (
                                        <Image
                                            src={project.image_url}
                                            alt={project.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <Building2 className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge className={`${project.status === 'Ready to Move' || project.status === 'Ready' ? 'bg-green-500' :
                                            project.status === 'New Launch' ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h3 className="text-white text-xl font-bold">{project.name}</h3>
                                        <p className="text-gray-200 text-sm">{project.builder_name || 'Builder'}</p>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {project.location?.locality || project.areas?.name}, {project.location?.city || project.cities?.name}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-lg font-bold text-primary">
                                            {project.description ? `${project.description.substring(0, 50)}...` : 'Premium Project'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No projects found.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
