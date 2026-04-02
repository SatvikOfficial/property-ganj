'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  HeartHandshake,
  ImageIcon,
  IndianRupee,
  Layers3,
  MapPin,
  PlayCircle,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
  Maximize2,
} from 'lucide-react';

import LikeButton from '@/components/LikeButton';
import { addRecentlyViewed, recordPropertyActivity } from '@/lib/recently-viewed';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  buildGeoapifyStaticMapUrl,
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
  buildLocationQuery,
  geocodeLocation,
} from '@/lib/geoapify';

type PropertyMediaItem = {
  id: string;
  url: string;
  category?: string;
  label?: string;
  isPrimary?: boolean;
};

type PropertyDetail = {
  id: string;
  listingId: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  purpose: 'sale' | 'rent';
  propertyType: string;
  dbPropertyType: string;
  status: string;
  listedBy: string;
  listedByRole: string;
  propertyGanjSubdivision?: string | null;
  location: {
    city?: string;
    locality?: string;
    area?: string;
    sector?: string;
    block?: string;
    road?: string;
    address?: string;
    landmark?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  };
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    parking?: number;
    carpetArea?: number;
    builtUpArea?: number;
    plotArea?: number;
    areaUnit?: string;
    furnishing?: string;
    floorNo?: number;
    totalFloors?: number;
    age?: string;
    facing?: string;
    possessionStatus?: string;
    availableFrom?: string;
    noOfOpenSides?: number;
    widthOfRoadFacing?: number;
    anyConstructionDone?: boolean;
    boundaryWallMade?: boolean;
    isInGatedColony?: boolean;
    isCornerPlot?: boolean;
    floorsAllowedForConstruction?: number;
  };
  pricing: {
    maintenance?: number;
    deposit?: number;
    bookingAmount?: number;
  };
  amenities: string[];
  highlights: string[];
  tags: string[];
  media: {
    photos: PropertyMediaItem[];
    floorplans: { id: string; url: string; label: string }[];
    videoUrl?: string;
  };
  hold: {
    byUserId?: string;
    expiresAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

type SimilarProperty = {
  id: string;
  title: string;
  location: string;
  price: number;
  area?: string;
  image?: string;
  purpose?: 'sale' | 'rent';
  propertyType?: string;
};

type ViewerProfile = {
  isAuthenticated: boolean;
  name?: string;
  phone?: string;
  email?: string;
};

type PropertyDetailClientProps = {
  property: PropertyDetail;
  similar: SimilarProperty[];
  initialSaved: boolean;
  initialInterest: boolean;
  viewer: ViewerProfile;
};

const formatCurrency = (value: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatCompactDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export function PropertyDetailClient({
  property,
  similar,
  initialSaved,
  initialInterest,
  viewer,
}: PropertyDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const [interestRequested, setInterestRequested] = useState(initialInterest);
  const [resolvedMapLocation, setResolvedMapLocation] = useState<{
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [interestForm, setInterestForm] = useState({
    name: viewer.name || '',
    phone: viewer.phone || '',
    email: viewer.email || '',
  });
  const [mobileGalleryTouchStart, setMobileGalleryTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showMobileCta, setShowMobileCta] = useState(false);

  const galleryImages = useMemo(
    () =>
      property.media.photos.length > 0
        ? property.media.photos
        : [
            {
              id: `${property.id}-placeholder`,
              url: '/placeholder.svg',
              label: 'Listing image',
              category: 'exterior',
              isPrimary: true,
            },
          ],
    [property.id, property.media.photos],
  );

  // Track this property view
  useEffect(() => {
    if (property.id) addRecentlyViewed(property.id);
  }, [property.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMobileCta = () => {
      if (window.innerWidth >= 768) {
        setShowMobileCta(false);
        return;
      }

      const threshold = Math.max(window.innerHeight * 0.62, 280);
      setShowMobileCta(window.scrollY > threshold);
    };

    updateMobileCta();
    window.addEventListener('scroll', updateMobileCta, { passive: true });
    window.addEventListener('resize', updateMobileCta);

    return () => {
      window.removeEventListener('scroll', updateMobileCta);
      window.removeEventListener('resize', updateMobileCta);
    };
  }, []);

  const activeImage = galleryImages[currentImageIndex] || galleryImages[0];
  const locationLine = [property.location.locality, property.location.area, property.location.city]
    .filter(Boolean)
    .join(', ');
  const mapSearchQuery = buildLocationQuery([
    property.location.address,
    property.location.landmark,
    property.location.road,
    property.location.locality,
    property.location.area,
    property.location.city,
    property.location.pincode,
  ]);

  const geoapifyKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const previewLatitude = property.location.latitude ?? resolvedMapLocation?.latitude;
  const previewLongitude = property.location.longitude ?? resolvedMapLocation?.longitude;
  const mapPreviewUrl = buildGeoapifyStaticMapUrl({
    latitude: previewLatitude,
    longitude: previewLongitude,
    apiKey: geoapifyKey,
    width: 1400,
    height: 760,
    zoom: 15,
  });
  const googleMapsEmbedUrl = buildGoogleMapsEmbedUrl(mapSearchQuery);
  const googleMapsSearchUrl = buildGoogleMapsSearchUrl(mapSearchQuery);

  useEffect(() => {
    let isCancelled = false;

    if (
      property.location.latitude !== undefined &&
      property.location.longitude !== undefined
    ) {
      setResolvedMapLocation(null);
      return () => {
        isCancelled = true;
      };
    }

    if (!geoapifyKey || !mapSearchQuery) {
      setResolvedMapLocation(null);
      return () => {
        isCancelled = true;
      };
    }

    const resolveMapLocation = async () => {
      const resolved = await geocodeLocation({
        city: property.location.city,
        locality: property.location.locality,
        area: property.location.area,
        sector: property.location.sector,
        block: property.location.block,
        road: property.location.road,
        address: property.location.address,
        pincode: property.location.pincode,
        landmark: property.location.landmark,
      }, geoapifyKey);

      if (!isCancelled) {
        setResolvedMapLocation(
          resolved?.latitude !== undefined && resolved.longitude !== undefined
            ? {
                latitude: resolved.latitude,
                longitude: resolved.longitude,
              }
            : null,
        );
      }
    };

    resolveMapLocation();

    return () => {
      isCancelled = true;
    };
  }, [
    geoapifyKey,
    mapSearchQuery,
    property.location.address,
    property.location.area,
    property.location.block,
    property.location.city,
    property.location.landmark,
    property.location.latitude,
    property.location.locality,
    property.location.longitude,
    property.location.pincode,
    property.location.road,
    property.location.sector,
  ]);

  const displayArea =
    property.specs.carpetArea || property.specs.plotArea || property.specs.builtUpArea || undefined;
  const rateDenominator = property.specs.carpetArea || property.specs.plotArea || property.specs.builtUpArea;
  const ratePerUnit = rateDenominator ? Math.round(property.price / rateDenominator) : null;

  const heroFacts = [
    property.specs.bedrooms ? { label: 'Bedrooms', value: `${property.specs.bedrooms}` } : null,
    property.specs.bathrooms ? { label: 'Bathrooms', value: `${property.specs.bathrooms}` } : null,
    displayArea
      ? {
          label: property.dbPropertyType === 'land' ? 'Plot area' : 'Area',
          value: `${displayArea} ${property.specs.areaUnit || 'sqft'}`,
        }
      : null,
    property.specs.furnishing ? { label: 'Furnishing', value: property.specs.furnishing } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const specificationFacts = [
    property.specs.bedrooms ? { label: 'Bedrooms', value: `${property.specs.bedrooms}` } : null,
    property.specs.bathrooms ? { label: 'Bathrooms', value: `${property.specs.bathrooms}` } : null,
    property.specs.balconies ? { label: 'Balconies', value: `${property.specs.balconies}` } : null,
    property.specs.carpetArea ? { label: 'Carpet area', value: `${property.specs.carpetArea} ${property.specs.areaUnit || 'sqft'}` } : null,
    property.specs.builtUpArea ? { label: 'Built-up area', value: `${property.specs.builtUpArea} ${property.specs.areaUnit || 'sqft'}` } : null,
    property.specs.plotArea ? { label: 'Plot area', value: `${property.specs.plotArea} ${property.specs.areaUnit || 'sqft'}` } : null,
    property.specs.floorNo !== undefined
      ? { label: 'Floor', value: `${property.specs.floorNo}${property.specs.totalFloors ? ` / ${property.specs.totalFloors}` : ''}` }
      : null,
    property.specs.totalFloors ? { label: 'Total floors', value: `${property.specs.totalFloors}` } : null,
    property.specs.furnishing ? { label: 'Furnishing', value: property.specs.furnishing } : null,
    property.specs.age ? { label: 'Property age', value: property.specs.age } : null,
    property.specs.facing ? { label: 'Facing', value: property.specs.facing } : null,
    property.specs.parking ? { label: 'Parking', value: `${property.specs.parking} slot${property.specs.parking > 1 ? 's' : ''}` } : null,
    property.specs.possessionStatus ? { label: 'Possession', value: property.specs.possessionStatus } : null,
    property.specs.availableFrom ? { label: 'Available from', value: formatCompactDate(property.specs.availableFrom) || property.specs.availableFrom } : null,
    property.specs.noOfOpenSides ? { label: 'Open sides', value: `${property.specs.noOfOpenSides}` } : null,
    property.specs.widthOfRoadFacing ? { label: 'Road width', value: `${property.specs.widthOfRoadFacing} m` } : null,
    property.specs.anyConstructionDone !== undefined ? { label: 'Construction done', value: property.specs.anyConstructionDone ? 'Yes' : 'No' } : null,
    property.specs.boundaryWallMade !== undefined ? { label: 'Boundary wall', value: property.specs.boundaryWallMade ? 'Yes' : 'No' } : null,
    property.specs.isInGatedColony !== undefined ? { label: 'Gated colony', value: property.specs.isInGatedColony ? 'Yes' : 'No' } : null,
    property.specs.isCornerPlot !== undefined ? { label: 'Corner plot', value: property.specs.isCornerPlot ? 'Yes' : 'No' } : null,
    property.specs.floorsAllowedForConstruction
      ? { label: 'Floors allowed', value: `${property.specs.floorsAllowedForConstruction}` }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const locationFacts = [
    property.location.address ? { label: 'Address line', value: property.location.address } : null,
    property.location.area ? { label: 'Area / zone', value: property.location.area } : null,
    property.location.sector ? { label: 'Sector / block', value: property.location.sector } : null,
    property.location.block ? { label: 'Sub-block / colony', value: property.location.block } : null,
    property.location.road ? { label: 'Primary road', value: property.location.road } : null,
    property.location.landmark ? { label: 'Landmark', value: property.location.landmark } : null,
    property.location.pincode ? { label: 'Pincode', value: property.location.pincode } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const pricingFacts = [
    property.pricing.maintenance ? { label: 'Maintenance', value: formatCurrency(property.pricing.maintenance) } : null,
    property.pricing.deposit ? { label: 'Security deposit', value: formatCurrency(property.pricing.deposit) } : null,
    property.pricing.bookingAmount ? { label: 'Booking amount', value: formatCurrency(property.pricing.bookingAmount) } : null,
    ratePerUnit ? { label: `Approx. rate / ${property.specs.areaUnit || 'sqft'}`, value: `₹${ratePerUnit.toLocaleString('en-IN')}` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const timelineFacts = [
    property.publishedAt ? { label: 'Published', value: formatCompactDate(property.publishedAt) } : null,
    property.updatedAt ? { label: 'Updated', value: formatCompactDate(property.updatedAt) } : null,
    property.listingId ? { label: 'Listing ref', value: property.listingId } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const listingRoleLabel =
    property.listedByRole === 'property-ganj'
      ? 'Property Ganj curated'
      : `${property.listedByRole.charAt(0).toUpperCase()}${property.listedByRole.slice(1)} listed`;

  const handleShare = async () => {
    const sharePayload = {
      title: property.title,
      text: `${property.title} · ${locationLine || property.location.city || 'Lucknow'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied',
          description: 'Property page URL copied to your clipboard.',
        });
      }
    } catch {
      // no-op
    }
  };

  const handleInterestSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!viewer.isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login so Property Ganj can route your interest to the right team.',
        variant: 'destructive',
      });
      router.push('/auth');
      return;
    }

    if (!interestForm.name.trim() || !interestForm.phone.trim()) {
      toast({
        title: 'Name and phone required',
        description: 'We need your details to arrange a callback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingInterest(true);
    try {
      const response = await fetch(`/api/properties/${property.id}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interestForm),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to submit interest');
      }

      setInterestRequested(true);
      setIsInterestOpen(false);
      recordPropertyActivity(property.id, 'interest');
      toast({
        title: 'Interest recorded',
        description: 'Property Ganj has your request and can route it internally.',
      });
    } catch (error) {
      toast({
        title: 'Unable to record interest',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingInterest(false);
    }
  };

  const canMovePrev = galleryImages.length > 1;
  const canMoveNext = galleryImages.length > 1;

  const handleMobileGalleryTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;

    setMobileGalleryTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleMobileGalleryTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (!touch || !mobileGalleryTouchStart || galleryImages.length <= 1) {
      setMobileGalleryTouchStart(null);
      return;
    }

    const deltaX = touch.clientX - mobileGalleryTouchStart.x;
    const deltaY = touch.clientY - mobileGalleryTouchStart.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe) {
      setCurrentImageIndex((prev) => {
        if (deltaX < 0) return (prev + 1) % galleryImages.length;
        return (prev - 1 + galleryImages.length) % galleryImages.length;
      });
      setZoomLevel(1);
    }

    setMobileGalleryTouchStart(null);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:px-6 md:py-10 md:pb-10">
        <section className="overflow-hidden rounded-[30px] border border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.95),rgba(255,255,255,0.98))] shadow-[0_32px_100px_-56px_rgba(15,23,42,0.42)] md:rounded-[34px]" data-mobile-reveal="pending">
          <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[1.3fr,0.7fr] lg:gap-8 lg:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2" data-mobile-reveal="pending">
                <span className="rounded-full bg-[#1f2a2e] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  {property.purpose === 'rent' ? 'For rent' : 'For sale'}
                </span>
                <span className="rounded-full border border-[#eadcca] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1f2a2e]">
                  {property.propertyType}
                </span>
                <span className="rounded-full border border-[#f1d4c8] bg-[#fff2eb] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#b55334]">
                  {listingRoleLabel}
                </span>
                {property.propertyGanjSubdivision ? (
                  <span className="rounded-full border border-[#dce9df] bg-[#eff9f1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f6f4f]">
                    {property.propertyGanjSubdivision}
                  </span>
                ) : null}
              </div>

              <div className="space-y-3" data-mobile-reveal="pending" data-mobile-reveal-delay="80" style={{ ["--pg-reveal-delay" as string]: "80ms" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9ca3af]">
                  Listing ref · {property.listingId}
                </p>
                <h1 className="max-w-4xl text-[2rem] font-black tracking-tight text-[#1f2a2e] md:text-[2.7rem] md:leading-[1.04]">
                  {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                  <MapPin className="h-4 w-4 text-[#eb6239]" />
                  <span>{locationLine || property.location.address || 'Lucknow'}</span>
                </div>
              </div>

              <div className="grid gap-4 rounded-[24px] border border-[#eadcca] bg-white/88 p-4 md:grid-cols-[1fr,auto] md:items-end md:rounded-[28px]" data-mobile-reveal="pending" data-mobile-reveal-delay="160" style={{ ["--pg-reveal-delay" as string]: "160ms" }}>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9ca3af]">
                    {property.purpose === 'rent' ? 'Monthly rent' : 'Quoted price'}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">
                    {formatCurrency(property.price, property.currency)}
                  </p>
                  {ratePerUnit ? (
                    <p className="mt-2 text-sm text-[#667085]">
                      Approx. ₹{ratePerUnit.toLocaleString('en-IN')} / {property.specs.areaUnit || 'sqft'}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <div className="relative h-11 w-11 rounded-full">
                    <LikeButton propertyId={property.id} initialLiked={initialSaved} className="static h-11 w-11 rounded-full border border-[#eadcca] bg-white shadow-none" iconClassName="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eadcca] bg-white text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#eadcca] bg-[#f7f2ec] md:rounded-[30px]" data-mobile-reveal="pending" data-mobile-reveal-delay="240" style={{ ["--pg-reveal-delay" as string]: "240ms" }}>
                <div className="relative md:hidden">
                  <div
                    className="relative aspect-[16/12] overflow-hidden bg-[#f1ebe4]"
                    onTouchStart={handleMobileGalleryTouchStart}
                    onTouchEnd={handleMobileGalleryTouchEnd}
                  >
                    <img
                      src={activeImage?.url || '/placeholder.svg'}
                      alt={activeImage?.label || property.title}
                      className="h-full w-full scale-[1.015] cursor-pointer object-cover transition-transform duration-500"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/88 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1f2a2e] backdrop-blur">
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>{currentImageIndex + 1} / {galleryImages.length}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <div className="rounded-full bg-black/38 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur">
                        Swipe to browse
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/92 px-3 py-2 text-xs font-semibold text-[#1f2a2e] shadow-[0_18px_34px_-24px_rgba(31,42,46,0.48)]"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        View all
                      </button>
                    </div>
                  </div>

                  {galleryImages.length > 1 ? (
                    <div className="pg-mobile-scroll-row px-3 pb-3 pt-3">
                      {galleryImages.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            'relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition',
                            index === currentImageIndex
                              ? 'border-[#eb6239] ring-2 ring-[#f9c7b4]'
                              : 'border-[#eadcca] opacity-80',
                          )}
                        >
                          <img src={image.url} alt={image.label || `Gallery ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                      {property.media.videoUrl ? (
                        <button
                          type="button"
                          onClick={() => setIsLightboxOpen(true)}
                          className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-[#eadcca] bg-[#1f2a2e] text-white transition"
                        >
                          <PlayCircle className="h-6 w-6" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="hidden md:block">
                  {galleryImages.length >= 3 ? (
                    <div className="grid aspect-[16/8] grid-cols-4 grid-rows-2 gap-1">
                      <div className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden" onClick={() => { setCurrentImageIndex(0); setIsLightboxOpen(true); }}>
                        <img src={galleryImages[0]?.url || '/placeholder.svg'} alt={galleryImages[0]?.label || property.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      </div>
                      <div className="relative cursor-pointer overflow-hidden" onClick={() => { setCurrentImageIndex(1); setIsLightboxOpen(true); }}>
                        <img src={galleryImages[1]?.url || '/placeholder.svg'} alt={galleryImages[1]?.label || 'Photo 2'} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                      </div>
                      <div className="relative cursor-pointer overflow-hidden" onClick={() => { setCurrentImageIndex(2); setIsLightboxOpen(true); }}>
                        <img src={galleryImages[2]?.url || '/placeholder.svg'} alt={galleryImages[2]?.label || 'Photo 3'} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                      </div>
                      {galleryImages.length >= 4 ? (
                        <div className="relative cursor-pointer overflow-hidden" onClick={() => { setCurrentImageIndex(3); setIsLightboxOpen(true); }}>
                          <img src={galleryImages[3]?.url || '/placeholder.svg'} alt={galleryImages[3]?.label || 'Photo 4'} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                        </div>
                      ) : (
                        <div className="bg-[#f1ebe4]" />
                      )}
                      {galleryImages.length >= 5 ? (
                        <div className="relative cursor-pointer overflow-hidden" onClick={() => { setCurrentImageIndex(4); setIsLightboxOpen(true); }}>
                          <img src={galleryImages[4]?.url || '/placeholder.svg'} alt={galleryImages[4]?.label || 'Photo 5'} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                          {galleryImages.length > 5 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <span className="text-lg font-bold text-white">+{galleryImages.length - 5} more</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#f1ebe4]" />
                      )}
                    </div>
                  ) : (
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#f1ebe4]">
                      <img
                        src={activeImage?.url || '/placeholder.svg'}
                        alt={activeImage?.label || property.title}
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() => setIsLightboxOpen(true)}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                      {canMovePrev ? (
                        <button
                          type="button"
                          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                          className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1f2a2e] shadow-lg transition hover:bg-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                      ) : null}
                      {canMoveNext ? (
                        <button
                          type="button"
                          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)}
                          className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1f2a2e] shadow-lg transition hover:bg-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      ) : null}
                    </div>
                  )}

                  {galleryImages.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-hide">
                      {galleryImages.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => { setCurrentImageIndex(index); setIsLightboxOpen(true); }}
                          className={cn(
                            'relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition',
                            index === currentImageIndex
                              ? 'border-[#eb6239] ring-2 ring-[#f9c7b4]'
                              : 'border-[#eadcca] opacity-70 hover:opacity-100',
                          )}
                        >
                          <img src={image.url} alt={image.label || `Gallery ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                      {property.media.videoUrl ? (
                        <button
                          type="button"
                          onClick={() => setIsLightboxOpen(true)}
                          className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-[#eadcca] bg-[#1f2a2e] text-white cursor-pointer transition hover:bg-[#2d3c40]"
                        >
                          <PlayCircle className="h-6 w-6" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-2 text-xs text-[#667085]">
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>{galleryImages.length} photos</span>
                      {property.media.videoUrl ? <span>• 1 video</span> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#eadcca] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f2a2e] transition hover:border-[#eb6239] hover:text-[#eb6239]"
                    >
                      <Maximize2 className="h-3 w-3" />
                      View all photos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-5 shadow-[0_22px_60px_-36px_rgba(15,23,42,0.34)]" data-mobile-reveal="pending" data-mobile-reveal-delay="300" style={{ ["--pg-reveal-delay" as string]: "300ms" }}>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2a2e]">
                  <ShieldCheck className="h-4 w-4 text-[#eb6239]" />
                  Managed buyer flow
                </div>
                <p className="mt-3 text-sm leading-7 text-[#667085]">
                  Direct seller contact stays private. Property Ganj captures your request, then the admin can follow up directly or route the property to an agent using the internal hold workflow.
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    'Send a callback request with your profile details.',
                    'Property Ganj sees the interest in the admin dashboard.',
                    'An admin can handle it personally or assign an agent.',
                  ].map((step) => (
                    <div key={step} className="flex items-start gap-3 rounded-[20px] bg-[#fff8f3] px-4 py-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#eb6239]" />
                      <p className="text-sm leading-6 text-[#4b5563]">{step}</p>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={() => setIsInterestOpen(true)}
                  className="mt-5 h-auto w-full rounded-[18px] bg-[#eb6239] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_36px_-18px_rgba(235,98,57,0.68)] hover:bg-[#d85a35]"
                >
                  <HeartHandshake className="mr-2 h-4 w-4" />
                  {interestRequested ? 'Interest already recorded' : 'Request Property Ganj callback'}
                </Button>
                {interestRequested ? (
                  <p className="mt-3 text-xs leading-5 text-[#667085]">
                    Your profile is already marked as interested for this property.
                  </p>
                ) : null}
              </div>

              <div className="rounded-[30px] border border-[#eadcca] bg-[#1f2a2e] p-5 text-white shadow-[0_24px_64px_-40px_rgba(15,23,42,0.58)]" data-mobile-reveal="pending" data-mobile-reveal-delay="360" style={{ ["--pg-reveal-delay" as string]: "360ms" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">Quick snapshot</p>
                <div className="mt-4 grid gap-3">
                  {heroFacts.map((fact) => (
                    <div key={fact.label} className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/6 px-4 py-3">
                      <span className="text-sm text-white/70">{fact.label}</span>
                      <span className="text-sm font-bold text-white">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {property.tags.length > 0 ? (
                <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-5" data-mobile-reveal="pending" data-mobile-reveal-delay="420" style={{ ["--pg-reveal-delay" as string]: "420ms" }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9ca3af]">Search tags</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#eadcca] bg-[#fff7f1] px-3 py-1.5 text-xs font-semibold text-[#1f2a2e]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr),340px]">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#fff1ea] p-3 text-[#eb6239]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">About this listing</h2>
                  <p className="text-sm text-[#667085]">The complete story behind the property, not just the headline.</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-8 text-[#4b5563]">
                {property.description || 'A detailed description will appear here once the listing owner adds the full narrative.'}
              </p>
              {property.highlights.length > 0 ? (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {property.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-3 rounded-[22px] border border-[#eadcca] bg-[#fffaf5] px-4 py-4">
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#eb6239]" />
                      <span className="text-sm leading-6 text-[#1f2a2e]">{highlight}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#eff8f0] p-3 text-[#2f6f4f]">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">Specifications</h2>
                  <p className="text-sm text-[#667085]">Everything a serious buyer typically asks for before a site visit.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {specificationFacts.map((fact) => (
                  <div key={fact.label} className="rounded-[22px] border border-[#eadcca] bg-[#fffaf5] px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9ca3af]">{fact.label}</p>
                    <p className="mt-2 text-base font-bold text-[#1f2a2e]">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {property.amenities.length > 0 ? (
              <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#fff1ea] p-3 text-[#eb6239]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">Amenities</h2>
                    <p className="text-sm text-[#667085]">Shared facilities and conveniences advertised with the listing.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-start gap-3 rounded-[22px] border border-[#eadcca] bg-[#fffaf5] px-4 py-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#eb6239]" />
                      <span className="text-sm leading-6 text-[#1f2a2e]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {property.media.floorplans.length > 0 ? (
              <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#eef4ff] p-3 text-[#4460e6]">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">Floor plans</h2>
                    <p className="text-sm text-[#667085]">Layout references for buyers comparing room flow and usable space.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {property.media.floorplans.map((plan) => (
                    <div key={plan.id} className="overflow-hidden rounded-[24px] border border-[#eadcca] bg-[#fffaf5]">
                      <div className="relative aspect-[4/3] bg-[#f6f0ea]">
                        <img src={plan.url} alt={plan.label} className="h-full w-full object-contain p-4" />
                      </div>
                      <div className="border-t border-[#eadcca] px-4 py-4">
                        <p className="text-sm font-bold text-[#1f2a2e]">{plan.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {property.media.videoUrl ? (
              <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#fff1ea] p-3 text-[#eb6239]">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">Virtual tour</h2>
                    <p className="text-sm text-[#667085]">A quick walkthrough for remote evaluation before a visit.</p>
                  </div>
                </div>
                <div className="mt-6 overflow-hidden rounded-[26px] border border-[#eadcca]">
                  <div className="aspect-video bg-[#f6f0ea]">
                    <iframe
                      src={property.media.videoUrl}
                      title="Property video"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#fff1ea] p-3 text-[#eb6239]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">Location context</h2>
                  <p className="text-sm text-[#667085]">Enough micro-location detail to decide whether the property deserves a visit.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.12fr),minmax(300px,0.88fr)]">
                <div className="overflow-hidden rounded-[28px] border border-[#eadcca] bg-[#f6f0ea]">
                  {mapPreviewUrl ? (
                    <div className="relative">
                      <img
                        src={mapPreviewUrl}
                        alt={`Map preview for ${property.title}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,42,46,0.02)_0%,rgba(31,42,46,0)_40%,rgba(31,42,46,0.42)_100%)]" />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1f2a2e] backdrop-blur">
                        Locality map
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Pinned around</p>
                          <p className="mt-1 text-lg font-black text-white">{locationLine || property.location.city || 'Property location'}</p>
                        </div>
                        {googleMapsSearchUrl ? (
                          <a
                            href={googleMapsSearchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1f2a2e] shadow-[0_18px_34px_-24px_rgba(31,42,46,0.48)] transition hover:-translate-y-0.5"
                          >
                            Open in Google Maps
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : googleMapsEmbedUrl ? (
                    <iframe
                      src={googleMapsEmbedUrl}
                      title={`Map for ${property.title}`}
                      className="h-[320px] w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center px-6 text-center text-sm leading-7 text-[#667085]">
                      The listing has location details, but the live map could not be loaded right now.
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-[26px] border border-[#eadcca] bg-[#fffaf5] p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Neighbourhood snapshot</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ca3af]">Locality</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#1f2a2e]">
                          {locationLine || property.location.address || 'Location shared by the seller'}
                        </p>
                      </div>
                      <div className="rounded-[20px] border border-[#eadcca] bg-white px-4 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ca3af]">Address signal</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#1f2a2e]">
                          {property.location.address || buildLocationQuery([property.location.road, property.location.landmark]) || 'Address detail available after callback'}
                        </p>
                      </div>
                    </div>
                    {(previewLatitude !== undefined && previewLongitude !== undefined) ? (
                      <p className="mt-4 text-xs leading-5 text-[#667085]">
                        Coordinates were resolved automatically so buyers can preview the micro-market without waiting for manual map data.
                      </p>
                    ) : null}
                  </div>

                  {locationFacts.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      {locationFacts.map((fact) => (
                        <div key={fact.label} className="rounded-[22px] border border-[#eadcca] bg-white px-4 py-4">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9ca3af]">{fact.label}</p>
                          <p className="mt-2 text-sm leading-7 text-[#1f2a2e]">{fact.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {googleMapsEmbedUrl ? (
                <div className="mt-4 overflow-hidden rounded-[26px] border border-[#eadcca] bg-white">
                  <div className="flex items-center justify-between border-b border-[#eadcca] px-4 py-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Interactive map</p>
                      <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">Google Maps view for this locality</p>
                    </div>
                    {googleMapsSearchUrl ? (
                      <a
                        href={googleMapsSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#eb6239] transition hover:underline"
                      >
                        Expand
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                  <iframe
                    src={googleMapsEmbedUrl}
                    title={`Interactive map for ${property.title}`}
                    className="h-[300px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9ca3af]">Commercial summary</p>
              <div className="mt-4 space-y-3">
                {pricingFacts.length > 0 ? (
                  pricingFacts.map((fact) => (
                    <div key={fact.label} className="flex items-center justify-between rounded-[18px] bg-[#fff8f3] px-4 py-3">
                      <span className="text-sm text-[#667085]">{fact.label}</span>
                      <span className="text-sm font-bold text-[#1f2a2e]">{fact.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] bg-[#fff8f3] px-4 py-4 text-sm leading-6 text-[#667085]">
                    No additional commercial terms have been shared for this listing yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#eadcca] bg-white/92 p-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.32)]" data-mobile-reveal="pending">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9ca3af]">Timeline</p>
              <div className="mt-4 space-y-3">
                {timelineFacts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between rounded-[18px] border border-[#eadcca] bg-white px-4 py-3">
                    <span className="text-sm text-[#667085]">{fact.label}</span>
                    <span className="text-sm font-bold text-[#1f2a2e]">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#eadcca] bg-[#1f2a2e] p-5 text-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.42)]" data-mobile-reveal="pending">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">Seller access policy</p>
              <p className="mt-3 text-sm leading-7 text-white/76">
                Property Ganj keeps the direct builder / owner contact private on the public listing page. Use the callback request button above if you want the team to connect you.
              </p>
              <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-white/10 bg-white/6 px-4 py-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#fbbf24]" />
                <p className="text-sm leading-6 text-white/78">
                  Listed by <span className="font-bold text-white">{property.listedBy}</span>
                </p>
              </div>
            </div>
          </aside>
        </section>

        {similar.length > 0 ? (
          <section className="mt-10 rounded-[34px] border border-[#eadcca] bg-white/92 p-6 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.36)] md:p-8" data-mobile-reveal="pending">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9ca3af]">More inventory</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f2a2e]">Similar listings</h2>
                <p className="mt-1 text-sm text-[#667085]">Properties that share the same market context and budget band.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {similar.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/property/${item.id}`}
                  className="group overflow-hidden rounded-[28px] border border-[#eadcca] bg-[#fffaf5] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-42px_rgba(15,23,42,0.34)]"
                  data-mobile-reveal="pending"
                  data-mobile-reveal-delay={String(Math.min(index * 70, 280))}
                  style={{ ["--pg-reveal-delay" as string]: `${Math.min(index * 70, 280)}ms` }}
                >
                  <div className="relative h-44 overflow-hidden bg-[#f3ece5]">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9ca3af]">
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>{item.propertyType || item.purpose || 'Listing'}</span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-black tracking-tight text-[#1f2a2e]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#667085]">{item.location}</p>
                    {item.area ? <p className="text-sm font-semibold text-[#1f2a2e]">{item.area}</p> : null}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-black text-[#eb6239]">{formatCurrency(item.price)}</p>
                      <ArrowUpRight className="h-4 w-4 text-[#1f2a2e] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[65] border-t border-[#eadcca] bg-white/96 shadow-[0_-18px_48px_-30px_rgba(15,23,42,0.34)] backdrop-blur-xl transition-transform duration-300 motion-reduce:transition-none md:hidden',
          showMobileCta ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 pg-mobile-safe-bottom">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">
              {property.purpose === 'rent' ? 'Monthly rent' : 'Quoted price'}
            </p>
            <p className="mt-1 truncate text-lg font-black tracking-tight text-[#1f2a2e]">
              {formatCurrency(property.price, property.currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eadcca] bg-white text-[#1f2a2e] shadow-[0_14px_30px_-24px_rgba(15,23,42,0.46)]"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <Button
            type="button"
            onClick={() => setIsInterestOpen(true)}
            className="h-12 flex-1 rounded-full bg-[#eb6239] px-5 text-sm font-bold text-white shadow-[0_18px_36px_-18px_rgba(235,98,57,0.68)] hover:bg-[#d85a35]"
          >
            <HeartHandshake className="mr-2 h-4 w-4" />
            {interestRequested ? 'Interest Sent' : 'Request Callback'}
          </Button>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          onClick={() => { setIsLightboxOpen(false); setZoomLevel(1); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setIsLightboxOpen(false); setZoomLevel(1); }
            if (e.key === 'ArrowRight') setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
            if (e.key === 'ArrowLeft') setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
          }}
          tabIndex={0}
          role="dialog"
          aria-label="Image lightbox"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 z-20" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 text-lg font-bold"
                title="Zoom out"
              >
                −
              </button>
              <span className="text-white/70 text-sm font-medium min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 text-lg font-bold"
                title="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => { setIsLightboxOpen(false); setZoomLevel(1); }}
                className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Image area — clicking the image itself doesn't close, clicking outside does */}
          <div className="flex flex-1 items-center justify-center overflow-auto px-16 py-4">
            <img
              src={galleryImages[currentImageIndex]?.url || '/placeholder.svg'}
              alt={galleryImages[currentImageIndex]?.label || `Photo ${currentImageIndex + 1}`}
              className="max-h-full object-contain rounded-lg transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, cursor: zoomLevel > 1 ? 'grab' : 'default' }}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>
          {/* Navigation arrows — always visible for single images too (as close hints) */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); setZoomLevel(1); }}
                className="absolute left-4 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length); setZoomLevel(1); }}
                className="absolute right-4 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}

      <Dialog open={isInterestOpen} onOpenChange={setIsInterestOpen}>
        <DialogContent className="rounded-[30px] border border-[#eadcca] bg-white p-0 sm:max-w-[560px]">
          <div className="overflow-hidden rounded-[30px]">
            <div className="border-b border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.95),rgba(255,255,255,0.98))] px-6 py-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-[#1f2a2e]">
                  Request a callback from Property Ganj
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-7 text-[#667085]">
                  Your request goes to Property Ganj, not directly to the builder or owner. The team can then follow up or route the property internally to an agent.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleInterestSubmit} className="space-y-5 px-6 py-6">
              <div className="rounded-[24px] border border-[#eadcca] bg-[#fffaf5] px-4 py-4">
                <p className="text-sm font-semibold text-[#1f2a2e]">{property.title}</p>
                <p className="mt-1 text-sm text-[#667085]">{locationLine || property.location.address || 'Lucknow'}</p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Your name</label>
                  <input
                    type="text"
                    value={interestForm.name}
                    onChange={(event) => setInterestForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-[18px] border border-[#eadcca] bg-white px-4 py-3 text-base outline-none transition focus:border-[#eb6239] md:text-sm"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Phone number</label>
                  <input
                    type="text"
                    value={interestForm.phone}
                    onChange={(event) => setInterestForm((prev) => ({ ...prev, phone: event.target.value }))}
                    className="w-full rounded-[18px] border border-[#eadcca] bg-white px-4 py-3 text-base outline-none transition focus:border-[#eb6239] md:text-sm"
                    placeholder="Mobile number"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Email (optional)</label>
                  <input
                    type="email"
                    value={interestForm.email}
                    onChange={(event) => setInterestForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-[18px] border border-[#eadcca] bg-white px-4 py-3 text-base outline-none transition focus:border-[#eb6239] md:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="rounded-[22px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-4 py-4 text-sm leading-7 text-[#667085]">
                A Property Ganj admin can see this request in the dashboard and assign the property to an agent through the existing hold system if needed.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInterestOpen(false)}
                  className="rounded-full border-[#eadcca] bg-white px-5 text-[#1f2a2e]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingInterest}
                  className="rounded-full bg-[#eb6239] px-5 font-bold text-white hover:bg-[#d95b36]"
                >
                  {isSubmittingInterest ? (
                    <>
                      <Copy className="mr-2 h-4 w-4 animate-pulse" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="mr-2 h-4 w-4" />
                      Submit callback request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
