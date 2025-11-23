"use client"
import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/Footer';
import { PopularLucknowLocality } from '@/data/lucknowLocalities';
import { LocalityInsights } from '@/components/property/LocalityInsights';
import PropertyCard from '@/components/property-card';
import { IProperty } from '@/models/Property';

export default function LocalityClientPage({ initialProperties, locality }: { initialProperties: IProperty[], locality: PopularLucknowLocality }) {

  const formattedProperties = initialProperties.map(property => ({
    id: property._id,
    _id: property._id,
    bhk: `${property.specs.bedrooms} BHK ${property.propertyType}`,
    price: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(property.price),
    sqft: property.specs.carpetArea || property.specs.builtUpArea || '—',
    location: `${property.location.locality}, ${property.location.city}`,
    image: property.media?.photos?.[0]?.url || '/placeholder.svg',
    beds: property.specs.bedrooms,
    baths: property.specs.bathrooms
  }));

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">{locality.label}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Properties in {locality.label}</h2>
            {formattedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formattedProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
               <p>No properties found in this locality.</p>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Locality Insights</h2>
            <LocalityInsights locality={locality.locality} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};