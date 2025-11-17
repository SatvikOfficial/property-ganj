'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, MapPin, Youtube } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import LikeButton from '@/components/LikeButton';

type PropertyMedia = {
  url: string;
  category?: string;
};

type PropertyDetail = {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  purpose: 'sale' | 'rent';
  propertyType: string;
  location: {
    city?: string;
    locality?: string;
    address?: string;
  };
  specs?: {
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    carpetArea?: number;
    builtUpArea?: number;
    areaUnit?: string;
    floorNo?: number;
    totalFloors?: number;
    furnishing?: string;
    age?: string;
    facing?: string;
    parking?: number;
  };
  amenities: string[];
  highlights: string[];
  media: {
    photos: PropertyMedia[];
    videoUrl?: string;
  };
  contact: {
    name: string;
    phone: string;
    email?: string | null;
  };
};

type SimilarProperty = {
  id: string;
  title: string;
  location: string;
  price: number;
  area?: string;
  image?: string;
};

type PropertyDetailClientProps = {
  property: PropertyDetail;
  similar: SimilarProperty[];
  initialLiked: boolean;
};

const formatCurrency = (value: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export function PropertyDetailClient({ property, similar, initialLiked }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = useMemo(
    () => property.media.photos.length ? property.media.photos : [{ url: '/placeholder.svg' }],
    [property.media.photos]
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const locationLine = [property.location.locality, property.location.city]
    .filter(Boolean)
    .join(', ');

  const specifications = [
    { key: 'Bedrooms', value: property.specs?.bedrooms },
    { key: 'Bathrooms', value: property.specs?.bathrooms },
    { key: 'Balconies', value: property.specs?.balconies },
    { key: 'Carpet Area', value: property.specs?.carpetArea ? `${property.specs?.carpetArea} ${property.specs?.areaUnit || 'sqft'}` : undefined },
    { key: 'Built-up Area', value: property.specs?.builtUpArea ? `${property.specs?.builtUpArea} ${property.specs?.areaUnit || 'sqft'}` : undefined },
    { key: 'Floor', value: property.specs?.floorNo !== undefined ? `${property.specs?.floorNo} / ${property.specs?.totalFloors ?? '—'}` : undefined },
    { key: 'Furnishing', value: property.specs?.furnishing },
    { key: 'Property Age', value: property.specs?.age },
    { key: 'Facing', value: property.specs?.facing },
    { key: 'Parking', value: property.specs?.parking !== undefined ? `${property.specs?.parking} slots` : undefined },
  ].filter((spec) => spec.value);

  return (
    <>
      <section className="relative h-64 md:h-80 w-full bg-muted overflow-hidden">
        <img
          src={galleryImages[currentImageIndex]?.url || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-primary w-8' : 'bg-white/60 w-2'}`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6 md:py-10 grid gap-6 md:gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-border pb-4 md:pb-6">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mb-2">
                {property.propertyType}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{locationLine}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{formatCurrency(property.price, property.currency)}</p>
                {property.specs?.carpetArea && (
                  <p className="text-xs md:text-sm text-muted-foreground">
                    ₹{Math.round(property.price / property.specs.carpetArea)} per {property.specs?.areaUnit || 'sqft'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <LikeButton propertyId={property.id} initialLiked={initialLiked} />
              <Button variant="outline" className="border-border" size="sm">
                <Share2 className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="py-4 md:py-8 border-b border-border">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">About this property</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {property.description || 'Detailed description will be available soon.'}
            </p>
          </div>

          <div className="py-4 md:py-8 border-b border-border">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {specifications.map((spec) => (
                <div key={spec.key} className="flex justify-between border border-border rounded-xl p-4">
                  <span className="text-muted-foreground text-sm">{spec.key}</span>
                  <span className="font-semibold text-foreground text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {property.amenities.length > 0 && (
            <div className="py-4 md:py-8 border-b border-border">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-sm">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.media.videoUrl && (
            <div className="py-8 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" /> Virtual Tour
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden border border-border">
                <iframe
                  src={property.media.videoUrl}
                  title="Property video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {property.highlights.length > 0 && (
            <div className="py-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Highlights</h2>
              <div className="grid gap-2">
                {property.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 md:space-y-6 mt-6 lg:mt-0">
          <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">Contact</p>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">{property.contact.name}</h3>
            <a 
              href={`tel:${property.contact.phone}`}
              className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 mb-2 md:mb-3 text-sm md:text-base text-center py-2 rounded-md font-semibold touch-manipulation"
            >
              Call {property.contact.name.split(' ')[0]}
            </a>
            <button 
              onClick={() => {
                if (property.contact.phone) {
                  navigator.clipboard.writeText(property.contact.phone);
                  alert(`Phone number copied: ${property.contact.phone}. We'll call you back soon!`);
                }
              }}
              className="w-full border border-border bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 mb-2 md:mb-3 text-sm md:text-base py-2 rounded-md font-semibold touch-manipulation"
            >
              Request Callback
            </button>
            <div className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-2">
              <p>Phone: {property.contact.phone}</p>
              {property.contact.email && <p>Email: {property.contact.email}</p>}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3">Location</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {property.location.address || 'Address details shared on request'}
            </p>
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="bg-accent/20 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Similar Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((item) => {
                const isPlaceholder = item.id?.toString().startsWith('placeholder-')
                const href = isPlaceholder ? `/property/placeholder/${item.id}` : `/property/${item.id}`
                return (
                <Link key={item.id} href={href} className="group">
                  <div className="bg-card rounded-xl overflow-hidden border border-border shadow hover:shadow-lg transition">
                    <div className="h-40 bg-muted overflow-hidden">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                      <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.area}</p>
                      <p className="text-primary font-bold">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

