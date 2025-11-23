import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db';
import Builder from '@/models/Builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone } from 'lucide-react';

async function getBuilders() {
    await connectDB();
    const builders = await Builder.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(builders));
}

export default async function BuildersPage() {
    const builders = await getBuilders();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Top Builders in Lucknow</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builders.map((builder: any) => (
                    <Link href={`/builders/${builder._id}`} key={builder._id}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                            <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center p-4">
                                {builder.logoUrl ? (
                                    <Image
                                        src={builder.logoUrl}
                                        alt={builder.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <Building2 className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl font-semibold">{builder.name}</CardTitle>
                                    {builder.totalProjects > 0 && (
                                        <Badge variant="secondary">{builder.totalProjects} Projects</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-gray-600">
                                    {builder.headquarters && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>
                                                {builder.headquarters.city}
                                                {builder.headquarters.state ? `, ${builder.headquarters.state}` : ''}
                                            </span>
                                        </div>
                                    )}
                                    {builder.contactPhone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            <span>{builder.contactPhone}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {builder.tags?.slice(0, 3).map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
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
