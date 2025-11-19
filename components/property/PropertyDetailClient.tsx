'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, MapPin, Youtube, X, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import LikeButton from '@/components/LikeButton';
import { EmiCalculator } from '@/components/property/EmiCalculator';
import { MortgageCalculator } from '@/components/property/MortgageCalculator';
import { RentAffordabilityCalculator } from '@/components/property/RentAffordabilityCalculator';
import { RentalYieldCalculator } from '@/components/property/RentalYieldCalculator';
import { LocalityInsights } from '@/components/property/LocalityInsights';
import { TOOL_DEFINITIONS } from '@/data/tools';

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
    area?: string;
    sector?: string;
    block?: string;
    road?: string;
    pincode?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
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
  locality?: string;
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [smartSimilar, setSmartSimilar] = useState<SimilarProperty[]>([]);
  const touchStartRef = useRef<number | null>(null);

  const galleryImages = useMemo(
    () => (property.media.photos.length ? property.media.photos : [{ url: '/placeholder.svg' }]),
    [property.media.photos],
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prevImage() : nextImage();
    }
    touchStartRef.current = null;
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  const locationLine = [property.location.locality, property.location.area, property.location.city]
    .filter(Boolean)
    .join(', ');
  const propertyRatePerSqft = property.specs?.carpetArea
    ? property.price / property.specs.carpetArea
    : undefined;
  const isForSale = property.purpose === 'sale';
  const isForRent = property.purpose === 'rent';
  const monthlyRentValue = isForRent ? property.price : Math.round(property.price / 12);
  const estimatedAssetPrice = isForRent ? property.price * 200 : property.price;

  useEffect(() => {
    let cancelled = false;

    const loadSmartMatches = async () => {
      try {
        const response = await fetch('/home.json');
        const payload = await response.json();
        const dataset = Array.isArray(payload?.properties) ? payload.properties : [];
        const localityToken = property.location.locality?.toLowerCase?.() ?? '';
        const basePrice = property.price || 0;

        const canonical = dataset
          .filter((item: any) => item?.id && item.id !== property.id)
          .map(
            (item: any): SimilarProperty => ({
              id: item.id,
              title: item.title,
              location: [item.locality, item.city].filter(Boolean).join(', '),
              price: item.price,
              area: item.area,
              image: item.image,
              locality: item.locality,
            }),
          );

        const byLocalityAndBudget = canonical.filter((item) => {
          const localityMatch = localityToken
            ? item.locality?.toLowerCase().includes(localityToken)
            : true;
          const budgetMatch =
            basePrice > 0 ? Math.abs(item.price - basePrice) <= basePrice * 0.25 : true;
          return localityMatch && budgetMatch;
        });

        let curated = byLocalityAndBudget;
        if (!curated.length) {
          curated = canonical.filter((item) =>
            basePrice > 0 ? Math.abs(item.price - basePrice) <= basePrice * 0.35 : true,
          );
        }
        if (!curated.length) {
          curated = canonical.slice(0, 4);
        }

        if (!cancelled) {
          setSmartSimilar(curated.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load smart similar properties', error);
      }
    };

    loadSmartMatches();
    return () => {
      cancelled = true;
    };
  }, [property.id, property.location.locality, property.price]);

  const geoapifyKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const mapPreviewUrl =
    property.location.latitude !== undefined &&
    property.location.longitude !== undefined &&
    geoapifyKey
      ? `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=320&center=lonlat:${property.location.longitude},${property.location.latitude}&zoom=15&marker=lonlat:${property.location.longitude},${property.location.latitude};color:%23eb6239;size:large&apiKey=${geoapifyKey}`
      : null;

  type LocationFact = { label: string; value: string };
  const locationFacts: LocationFact[] = ([
    property.location.locality
      ? { label: 'Colony / Locality', value: property.location.locality }
      : null,
    property.location.area ? { label: 'Area / Zone', value: property.location.area } : null,
    property.location.sector || property.location.block
      ? {
          label: 'Sector / Block',
          value: [property.location.sector, property.location.block].filter(Boolean).join(', '),
        }
      : null,
    property.location.road ? { label: 'Primary Road', value: property.location.road } : null,
    property.location.landmark ? { label: 'Landmark', value: property.location.landmark } : null,
    property.location.pincode ? { label: 'Pincode', value: property.location.pincode } : null,
    property.location.latitude !== undefined && property.location.longitude !== undefined
      ? {
          label: 'Coordinates',
          value: `${property.location.latitude.toFixed(5)}, ${property.location.longitude.toFixed(5)}`,
        }
      : null,
  ] as (LocationFact | null)[]).filter((item): item is LocationFact => Boolean(item && item.value));

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
      <section className="relative w-full bg-background">
        <div
          className="relative h-64 md:h-[460px] w-full bg-muted overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={galleryImages[currentImageIndex]?.url || '/placeholder.svg'}
            alt={`${property.title} photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03] cursor-zoom-in"
            onClick={() => openLightbox(currentImageIndex)}
            loading="lazy"
          />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => openLightbox(currentImageIndex)}
              className="bg-background/80 text-foreground rounded-full px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-background"
            >
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
              </span>
            </button>
          </div>

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

          <div className="absolute bottom-4 left-4 bg-background/80 text-foreground rounded-full px-4 py-1 text-xs font-semibold backdrop-blur-sm">
            {currentImageIndex + 1} / {galleryImages.length} photos
          </div>
          <div className="absolute bottom-4 right-4 hidden md:block text-xs text-muted-foreground bg-background/70 px-3 py-1 rounded-full backdrop-blur">
            Swipe or use arrows to explore
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="hidden md:flex gap-3 overflow-x-auto px-6 py-4 bg-background border-t border-border">
            {galleryImages.map((image, index) => (
              <button
                key={image.url + index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-20 w-32 rounded-xl overflow-hidden border transition-all ${
                  currentImageIndex === index ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                }`}
              >
                <img
                  src={image.url || '/placeholder.svg'}
                  alt={`${property.title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        <div className="md:hidden flex gap-2 justify-center py-3">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-primary w-8' : 'bg-muted-foreground/40 w-2'}`}
            />
          ))}
        </div>
      </section>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">Gallery Preview</p>
              <p className="text-sm font-semibold">
                {currentImageIndex + 1} / {galleryImages.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="border border-white/30 rounded-full p-2 hover:bg-white/10"
                aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                onClick={closeLightbox}
                className="border border-white/30 rounded-full p-2 hover:bg-white/10"
                aria-label="Close gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 pb-6">
            <div
              className="relative w-full max-w-5xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={galleryImages[currentImageIndex]?.url || '/placeholder.svg'}
                alt={`${property.title} photo ${currentImageIndex + 1}`}
                className={`w-full h-auto rounded-3xl shadow-2xl transition-transform duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={toggleZoom}
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full p-3 hover:bg-white/30"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full p-3 hover:bg-white/30"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto px-6 py-4 bg-black/70">
              {galleryImages.map((image, index) => (
                <button
                  key={image.url + index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-16 w-24 rounded-xl overflow-hidden border ${
                    currentImageIndex === index ? 'border-primary' : 'border-white/20'
                  }`}
                >
                  <img
                    src={image.url || '/placeholder.svg'}
                    alt={`${property.title} preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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

          <div className="py-8 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Tools</p>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Plan smarter with quick tools</h2>
                <p className="text-sm text-muted-foreground">EMIs, mortgages or rental math — pick the calculator you need.</p>
              </div>
              <Link
                href="/tools"
                className="text-sm font-semibold text-primary hover:opacity-80 transition"
              >
                View all tools →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOL_DEFINITIONS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className="group border border-border rounded-2xl p-4 flex items-start gap-4 hover:border-primary transition"
                  >
                    <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">{tool.highlight}</p>
                      <p className="text-lg font-semibold text-foreground">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
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

          {isForSale ? (
            <>
              <EmiCalculator
                defaultAmount={property.price}
                heading="Plan your EMI"
                className="shadow-lg"
                variant="compact"
              />
              <MortgageCalculator
                propertyPrice={property.price}
                heading="Mortgage Planner"
                className="shadow-lg"
                variant="compact"
              />
            </>
          ) : (
            <>
              <RentAffordabilityCalculator
                defaultRent={monthlyRentValue}
                defaultIncome={monthlyRentValue * 4}
                className="shadow-lg"
              />
              <RentalYieldCalculator
                propertyPrice={estimatedAssetPrice}
                monthlyRent={monthlyRentValue}
                className="shadow-lg"
                heading="Rental Yield Snapshot"
              />
            </>
          )}

          <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
            <h3 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3">Location</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {property.location.address || 'Address details shared on request'}
            </p>
            {locationFacts.length > 0 && (
              <dl className="mt-4 space-y-2 text-sm">
                {locationFacts.map((fact) => (
                  <div key={fact.label} className="flex justify-between gap-4 border border-border rounded-lg px-3 py-2">
                    <dt className="text-muted-foreground">{fact.label}</dt>
                    <dd className="font-semibold text-right">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {mapPreviewUrl ? (
              <img
                src={mapPreviewUrl}
                alt={`Map preview for ${property.location.locality || 'Lucknow'} property`}
                className="mt-4 w-full rounded-xl border border-border object-cover"
                loading="lazy"
              />
            ) : (
              <p className="text-xs text-muted-foreground mt-4">
                Add precise latitude & longitude to unlock the map preview for this listing.
              </p>
            )}
          </div>
        </aside>
      </section>

      <LocalityInsights
        locality={property.location.locality}
        city={property.location.city}
        propertyRatePerSqft={propertyRatePerSqft}
      />

      {smartSimilar.length > 0 && (
        <section className="bg-background py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Smart matches</p>
                <h2 className="text-2xl font-bold text-foreground">
                  More homes near {property.location.locality || property.location.city || 'you'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Curated using locality & budget resemblance from our featured inventory.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {smartSimilar.map((item) => {
                const isPlaceholder = item.id?.toString().startsWith('placeholder-');
                const href = isPlaceholder ? `/property/placeholder/${item.id}` : `/property/${item.id}`;
                return (
                  <Link key={`smart-${item.id}`} href={href} className="group">
                    <div className="bg-card rounded-xl overflow-hidden border border-border shadow hover:shadow-lg transition">
                      <div className="h-40 bg-muted overflow-hidden">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-xs uppercase text-muted-foreground tracking-wide">
                          {item.location}
                        </p>
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        {item.area && <p className="text-sm text-muted-foreground">{item.area}</p>}
                        <p className="text-primary font-bold">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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

