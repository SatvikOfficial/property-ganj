'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import LikeButton from '@/components/LikeButton';
import { Heart } from 'lucide-react';

const formatCurrency = (value?: number) => {
  if (!value) return '₹ —';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function LikedPropertiesPage() {
  const [likedProperties, setLikedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/profile/liked-properties');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to fetch liked properties');
        }
        setLikedProperties(data.likedProperties || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProperties();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Your Liked Properties</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && likedProperties.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No liked properties yet</h2>
            <p className="text-muted-foreground mb-4">
              Start exploring and like the properties you are interested in.
            </p>
            <Link href="/search">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:bg-primary/90">
                Explore Properties
              </button>
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedProperties.map((property) => {
            const area = property.specs?.carpetArea || property.specs?.builtUpArea;
            const bedrooms = property.specs?.bedrooms ? `${property.specs.bedrooms} BHK` : property.propertyType;
            const location = [property.location?.locality, property.location?.city].filter(Boolean).join(', ');
            const image = property.media?.photos?.[0]?.url || '/placeholder.svg';

            return (
              <div
                key={property._id}
                className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border"
              >
                <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={image}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2">
                    <LikeButton propertyId={property._id} initialLiked={true} />
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/property/${property._id}`}>
                    <h3 className="font-bold text-foreground hover:text-primary mb-1">{property.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3">{location}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">{formatCurrency(property.price)}</p>
                    <p className="text-sm text-muted-foreground">{bedrooms}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
