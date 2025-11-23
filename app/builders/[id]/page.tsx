import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Builder from '@/models/Builder';
import Project from '@/models/Project';
import Property from '@/models/Property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone, Mail, Globe, Calendar, CheckCircle, Clock } from 'lucide-react';
import PropertyCard from '@/components/property-card';

async function getBuilderData(id: string) {
  await connectDB();

  const builder = await Builder.findById(id).lean();
  if (!builder) return null;

  const projects = await Project.find({ builderId: id }).sort({ createdAt: -1 }).lean();

  // Get properties linked to this builder's projects or directly to the builder
  const projectIds = projects.map(p => p._id);
  const properties = await Property.find({
    $or: [
      { builderId: id },
      { projectId: { $in: projectIds } }
    ],
    status: 'published'
  }).limit(6).sort({ createdAt: -1 }).lean();

  return {
    builder: JSON.parse(JSON.stringify(builder)),
    projects: JSON.parse(JSON.stringify(projects)),
    properties: JSON.parse(JSON.stringify(properties))
  };
}

export default async function BuilderProfilePage({ params }: { params: { id: string } }) {
  const data = await getBuilderData(params.id);

  if (!data) {
    notFound();
  }

  const { builder, projects, properties } = data;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-50">
            {builder.logoUrl ? (
              <Image
                src={builder.logoUrl}
                alt={builder.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{builder.name}</h1>
              {builder.establishedYear && (
                <p className="text-gray-500 mt-1">Est. {builder.establishedYear}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {builder.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-gray-600 max-w-3xl leading-relaxed">
              {builder.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {builder.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={builder.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
              )}
              {builder.contactPhone && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${builder.contactPhone}`} className="gap-2">
                    <Phone className="w-4 h-4" />
                    {builder.contactPhone}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{builder.totalProjects || 0}</div>
            <div className="text-sm text-gray-500">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{builder.ongoingProjects || 0}</div>
            <div className="text-sm text-gray-500">Ongoing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{builder.completedProjects || 0}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{projects.length}</div>
            <div className="text-sm text-gray-500">Listed Here</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Projects by {builder.name}</h2>
            <Link href="/projects" className="text-primary hover:underline">View All Projects</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Link href={`/projects/${project._id}`} key={project._id}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                  <div className="relative h-48 w-full bg-gray-200">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
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
                      <Badge className={`${project.status === 'Ready to Move' ? 'bg-green-500' :
                          project.status === 'New Launch' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.location.locality}, {project.location.city}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(project.minPrice / 100000).toFixed(1)}L - ₹{(project.maxPrice / 100000).toFixed(1)}L
                      </div>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Properties Section */}
      {properties.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Properties in {builder.name} Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
