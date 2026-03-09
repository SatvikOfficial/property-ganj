import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone } from 'lucide-react';

async function getBuilders() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('projects')
        .select('builder_name, rera_number')
        .not('builder_name', 'is', null);
    
    if (!data || data.length === 0) return [];
    
    // Group by builder name and return unique builders
    const builderMap = new Map();
    data.forEach(project => {
        if (project.builder_name && !builderMap.has(project.builder_name)) {
            builderMap.set(project.builder_name, {
                name: project.builder_name,
                reraId: project.rera_number,
            });
        }
    });
    
    return Array.from(builderMap.values());
}

export default async function BuildersPage() {
    const builders = await getBuilders();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Top Builders in Lucknow</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builders.map((builder: any, index: number) => (
                    <Link href={`/builders/${encodeURIComponent(builder.name)}`} key={index}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                            <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center p-4">
                                <Building2 className="h-16 w-16 text-gray-400" />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl font-semibold">{builder.name}</CardTitle>
                                    {builder.reraId && (
                                        <Badge variant="outline">RERA: {builder.reraId}</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-600">
                                    <p>View projects from this builder</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {builders.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No builders found.</p>
                </div>
            )}
        </div>
    );
}
