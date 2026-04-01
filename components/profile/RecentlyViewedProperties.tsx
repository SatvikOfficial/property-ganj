'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowUpRight, Home } from 'lucide-react';
import { getRecentlyViewedIds, subscribeToRecentlyViewed } from '@/lib/recently-viewed';

interface RecentProperty {
  id: string;
  title: string;
  price: number | null;
  locality: string | null;
  city: string | null;
  property_type: string | null;
  image_url: string | null;
}

export function RecentlyViewedProperties() {
  const [properties, setProperties] = useState<RecentProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecent = async (ids = getRecentlyViewedIds(5)) => {
      if (ids.length === 0) {
        if (!cancelled) {
          setProperties([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/properties?ids=${encodeURIComponent(ids.join(','))}&limit=5`, {
          cache: 'no-store',
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load recently viewed properties');
        }

        const sorted = (data?.properties || []).map((property: any) => ({
          id: property.id,
          title: property.title || 'Untitled Property',
          price: property.price ?? null,
          locality: property.location?.locality || null,
          city: property.location?.city || null,
          property_type: property.propertyType || null,
          image_url: property.media?.photos?.[0]?.url || null,
        })) as RecentProperty[];

        if (!cancelled) {
          setProperties(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch recently viewed:', err);
        if (!cancelled) {
          setProperties([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecent();
    const unsubscribe = subscribeToRecentlyViewed((items) => {
      fetchRecent(items.slice(0, 5).map((item) => item.propertyId));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const formatPrice = (value: number | null) => {
    if (!value) return '₹ —';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recently Viewed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recently Viewed
        </h2>
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Home className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No properties viewed yet. Start browsing to see your history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Recently Viewed
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((prop) => (
          <Link
            key={prop.id}
            href={`/property/${prop.id}`}
            className="group flex gap-3 rounded-[22px] border border-[#eadcca] bg-white/95 p-3 shadow-[0_18px_36px_-30px_rgba(31,42,46,0.34)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_54px_-28px_rgba(31,42,46,0.24)]"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
              {prop.image_url ? (
                <Image
                  src={prop.image_url}
                  alt={prop.title}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Home className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                {prop.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {[prop.locality, prop.city].filter(Boolean).join(', ') || 'Location'}
              </p>
              {prop.property_type && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  {prop.property_type}
                </p>
              )}
              <p className="text-sm font-bold text-primary mt-1">{formatPrice(prop.price)}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
