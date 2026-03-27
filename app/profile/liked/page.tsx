'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import LikeButton from '@/components/LikeButton';
import { Heart, Home, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

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
    const fetchLikes = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Please log in to view liked properties.");
          setLoading(false);
          return;
        }

        const { data: likes, error: likesErr } = await supabase.from('likes').select('property_id').eq('user_id', user.id);
        if (likesErr) throw likesErr;

        if (!likes || likes.length === 0) {
          setLikedProperties([]);
          setLoading(false);
          return;
        }

        const ids = likes.map(l => l.property_id);
        const { data: props, error: propsErr } = await supabase.from('properties').select('*').in('id', ids);
        
        if (propsErr) throw propsErr;

        setLikedProperties(props || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch liked properties');
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
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
            const area = property.specs?.carpetArea || property.carpet_area_sqft || property.specs?.builtUpArea || property.built_up_area_sqft;
            const bedrooms = property.bedrooms || property.specs?.bedrooms;
            const propertyTypeStr = property.propertyType || property.property_type || 'Property';
            const bedroomsStr = bedrooms ? `${bedrooms} BHK ${propertyTypeStr}` : propertyTypeStr;
            const location = [property.locality || property.location?.locality, property.city || property.location?.city].filter(Boolean).join(', ');
            
            const fallbackImages = ["/modern-apartment.jpg", "/2bhk-flat.jpg", "/luxury-apartment-living-room.png", "/residential-property.jpg", "/residential-plots-green.jpg"];
            const idHash = property._id?.toString?.() ?? property.id ?? '';
            let hashNum = 0;
            for (let i = 0; i < idHash.length; i++) hashNum += idHash.charCodeAt(i);
            const defaultImg = fallbackImages[hashNum % fallbackImages.length];
            const image = property.media?.photos?.[0]?.url || property.images?.[0] || defaultImg;

            return (
              <div
                key={property.id}
                className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border"
              >
                <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={image}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2">
                    <LikeButton propertyId={property.id} initialLiked={true} />
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/property/${property.id}`}>
                    <h3 className="font-bold text-foreground hover:text-primary mb-1">{property.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3">{location}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">{formatCurrency(property.price)}</p>
                    <p className="text-sm text-muted-foreground">{bedroomsStr}</p>
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
