import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Property from '@/models/Property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/property-card';
import RecommendedProperties from '@/components/RecommendedProperties';

async function getProjectData(id: string) {
  await connectDB();

  const project = await Project.findById(id).populate('builderId').lean();
  if (!project) return null;

  const properties = await Property.find({
    projectId: id,
    status: 'published'
  }).sort({ createdAt: -1 }).lean();

  return {
    project: JSON.parse(JSON.stringify(project)),
    properties: JSON.parse(JSON.stringify(properties))
  };
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const data = await getProjectData(params.id);

  if (!data) {
    notFound();
  }

  const { project, properties } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full bg-gray-900">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-32 h-32 text-gray-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-12 text-white">
          <div className="max-w-4xl">
            <div className="flex gap-2 mb-4">
              <Badge className={`${project.status === 'Ready to Move' ? 'bg-green-500' :
                project.status === 'New Launch' ? 'bg-blue-500' : 'bg-orange-500'
                } hover:bg-opacity-90`}>
                {project.status}
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                {project.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-200 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{project.location.locality}, {project.location.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>By {project.builderId?.name}</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-3xl font-bold text-white">
                ₹{(project.minPrice / 100000).toFixed(1)}L - ₹{(project.maxPrice / 100000).toFixed(1)}L
              </div>
              <p className="text-gray-400 text-sm mt-1">Base Price Range</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {project.reraId && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">RERA ID</div>
                      <div className="font-medium">{project.reraId}</div>
                    </div>
                  )}
                  {project.possessionDate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Possession</div>
                      <div className="font-medium">{project.possessionDate}</div>
                    </div>
                  )}
                  {project.totalUnits && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Total Units</div>
                      <div className="font-medium">{project.totalUnits}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {project.amenities?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {project.gallery?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((img: string, idx: number) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={img}
                          alt={`${project.name} gallery ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Properties List */}
            <div id="properties">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Available Properties</h2>
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property: any) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No individual properties listed yet for this project.
                    <br />
                    Contact the builder for inventory details.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Builder Card */}
            <Card>
              <CardHeader>
                <CardTitle>Developer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50">
                    {project.builderId?.logoUrl ? (
                      <Image
                        src={project.builderId.logoUrl}
                        alt={project.builderId.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{project.builderId?.name}</h3>
                    <Link
                      href={`/builders/${project.builderId?._id}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View Profile <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-center mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-bold">{project.builderId?.totalProjects || 0}</div>
                    <div className="text-gray-500 text-xs">Projects</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-bold">{project.builderId?.establishedYear || '-'}</div>
                    <div className="text-gray-500 text-xs">Est. Year</div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/builders/${project.builderId?._id}`}>
                    Contact Builder
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* In a real app, integrate Google Maps or similar here */}
                  <MapPin className="w-12 h-12 text-gray-400 mb-2" />
                  <div className="absolute bottom-4 text-sm text-gray-500 font-medium">
                    Map View
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Address:</p>
                  {project.location.locality}, {project.location.city}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recommended Properties */}
      <div className="mt-12">
        <RecommendedProperties title="Similar Projects & Properties" />
      </div>
    </div>
  );
}
