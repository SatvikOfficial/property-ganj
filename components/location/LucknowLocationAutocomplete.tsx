'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, LocateFixed, MapPin, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { POPULAR_LUCKNOW_LOCALITIES, PopularLucknowLocality } from '@/data/lucknowLocalities';
import { useToast } from '@/hooks/use-toast';

export type ResolvedLucknowLocation = {
  label: string;
  city: string;
  locality?: string;
  area?: string;
  sector?: string;
  block?: string;
  road?: string;
  neighbourhood?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  raw?: Record<string, unknown>;
};

type LucknowSuggestion = ResolvedLucknowLocation & { id: string };

// Removed strict city restriction
const CITY_CENTROID = { lat: 26.8467, lon: 80.9462 };

interface LucknowLocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: ResolvedLucknowLocation) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  dense?: boolean;
  showDetectButton?: boolean;
  disabled?: boolean;
}

export function extractStructuredLocation(feature: LucknowSuggestion): ResolvedLucknowLocation {
  return {
    label: feature.label,
    city: feature.city,
    locality: feature.locality,
    area: feature.area,
    sector: feature.sector,
    block: feature.block,
    road: feature.road,
    neighbourhood: feature.neighbourhood,
    pincode: feature.pincode,
    latitude: feature.latitude,
    longitude: feature.longitude,
    formattedAddress: feature.formattedAddress,
    raw: feature.raw,
  };
}

const GeoapifyWarning = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 px-3 py-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg">
    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

export default function LucknowLocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search localities, sectors, roads…',
  className,
  inputClassName,
  dense = false,
  showDetectButton = false,
  disabled = false,
}: LucknowLocationAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const [suggestions, setSuggestions] = useState<LucknowSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const debouncedValue = useDebouncedValue(value, 250);
  const trimmedValue = (debouncedValue || '').trim();
  const curatedSuggestions = useMemo(
    () => getCuratedSuggestions(trimmedValue),
    [trimmedValue]
  );

  useEffect(() => {
    if (!apiKey) {
      // Only show warning in dev/console or if really needed, but user asked to remove red text.
      // We'll keep the GeoapifyWarning component usage below if key is missing.
      setSuggestions(curatedSuggestions);
      setHighlightIndex(curatedSuggestions.length ? 0 : -1);
      return;
    }
  }, [apiKey, curatedSuggestions]);

  useEffect(() => {
    const shouldSkipGeo = !apiKey || trimmedValue.length < 2;
    if (shouldSkipGeo) {
      setSuggestions(curatedSuggestions);
      setHighlightIndex(curatedSuggestions.length ? 0 : -1);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          text: trimmedValue,
          // Removed BOUNDING_BOX to allow broader search
          bias: `proximity:${CITY_CENTROID.lon},${CITY_CENTROID.lat}`, // Still bias towards Lucknow but don't restrict
          limit: '7',
          lang: 'en',
          apiKey,
        });

        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Unable to fetch location suggestions');
        }
        const data = await response.json();
        const parsed: LucknowSuggestion[] =
          data.features
            ?.map((feature: any) => transformFeatureToSuggestion(feature))
            .filter(Boolean)
            .filter((suggestion: LucknowSuggestion | null): suggestion is LucknowSuggestion => Boolean(suggestion)) ?? [];

        const combined = mergeWithCurated(parsed, curatedSuggestions);
        setSuggestions(combined);
        setHighlightIndex(combined.length ? 0 : -1);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Geoapify autocomplete error', err);
        const combined = curatedSuggestions;
        setSuggestions(combined);
        setHighlightIndex(combined.length ? 0 : -1);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [trimmedValue, apiKey, curatedSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: LucknowSuggestion) => {
    onSelect(extractStructuredLocation(suggestion));
    onChange(suggestion.label);
    setIsMenuOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && highlightIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    }
  };

  const handleDetect = () => {
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "Geoapify API key is missing.",
        variant: "destructive",
      });
      return;
    }
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const params = new URLSearchParams({
            lat: latitude.toString(),
            lon: longitude.toString(),
            format: 'json',
            lang: 'en',
            apiKey,
          });
          const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`);
          if (!response.ok) {
            throw new Error('Unable to reverse geocode your location');
          }
          const data = await response.json();
          // Use the first result
          const suggestion = data.results?.[0] ? transformFeatureToSuggestion({ properties: data.results[0], geometry: { coordinates: [longitude, latitude] } }) : null;

          if (suggestion) {
            handleSelect(suggestion);
            toast({
              title: "Location Detected",
              description: `Detected: ${suggestion.label}`,
            });
          } else {
            toast({
              title: "Location Not Found",
              description: "Could not determine a valid address from your location.",
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error('Reverse geocoding failed', err);
          toast({
            title: "Error",
            description: "Failed to fetch address details.",
            variant: "destructive",
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        console.error('Geolocation error', geoError);
        let errorMsg = "Unable to retrieve your location.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please enable location services.";
        }
        toast({
          title: "Location Error",
          description: errorMsg,
          variant: "destructive",
        });
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleFocus = () => {
    setIsMenuOpen(true);
    if (!suggestions.length) {
      setSuggestions(curatedSuggestions);
      setHighlightIndex(curatedSuggestions.length ? 0 : -1);
    }
  };

  const suggestionList = useMemo(() => {
    if (!isMenuOpen || !suggestions.length) return null;
    return (
      <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            className={cn(
              'cursor-pointer px-4 py-2 text-sm hover:bg-secondary/20',
              highlightIndex === index && 'bg-secondary/20'
            )}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(suggestion)}
          >
            <p className="font-semibold text-foreground">{suggestion.label}</p>
            <p className="text-xs text-muted-foreground">
              {[suggestion.locality, suggestion.area, suggestion.city].filter(Boolean).join(' • ')}
            </p>
          </li>
        ))}
      </ul>
    );
  }, [suggestions, highlightIndex]);

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border border-border bg-white px-3',
          dense ? 'py-1.5 text-sm' : 'py-2 text-base',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={handleFocus}
          placeholder={apiKey ? placeholder : 'Add Geoapify API key to enable search'}
          onKeyDown={handleKeyDown}
          disabled={disabled || !apiKey}
          className={cn(
            'flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none',
            inputClassName
          )}
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        {showDetectButton && (
          <button
            type="button"
            onClick={handleDetect}
            disabled={isDetecting || disabled}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#eb6239] bg-[#fff3ed] p-2.5 text-[#eb6239] shadow-sm hover:bg-[#ffe6d9] disabled:opacity-60"
            title="Use current location"
          >
            {isDetecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LocateFixed className="h-5 w-5" />}
            <span className="sr-only">Use current location</span>
          </button>
        )}
      </div>
      {suggestionList}
      {!apiKey && <GeoapifyWarning message="Geoapify key missing. Update your .env file to enable smart search." />}
      {/* Removed red error text below input */}
    </div>
  );
}

function transformFeatureToSuggestion(feature: any): LucknowSuggestion | null {
  if (!feature?.properties) return null;
  const { properties, geometry } = feature;
  const latitude = geometry?.coordinates?.[1];
  const longitude = geometry?.coordinates?.[0];

  // Extract specific fields as requested by user
  const housenumber = properties.housenumber;
  const street = properties.street || properties.road;
  const suburb = properties.suburb;
  const district = properties.district;
  const city = properties.city;
  const postcode = properties.postcode;

  const locality =
    suburb ||
    properties.quarter ||
    properties.neighbourhood ||
    properties.city_block ||
    properties.city_district;

  const area = district || properties.borough || suburb;

  const sector = properties.city_block || properties.quarter;
  const block = properties.neighbourhood || properties.block;
  const road = street;

  // Use formatted property as primary label if available, as requested
  const label =
    properties.formatted ||
    properties.address_line1 ||
    properties.name ||
    [locality, area, city].filter(Boolean).join(', ');

  return {
    id: String(properties.place_id || properties.osm_id || `${latitude}-${longitude}`),
    label,
    city: city || 'Unknown City', // Default if city missing
    locality: locality || properties.name,
    area,
    sector,
    block,
    road,
    neighbourhood: properties.neighbourhood || properties.quarter,
    pincode: postcode,
    latitude,
    longitude,
    formattedAddress: properties.formatted || properties.address_line1,
    raw: properties,
  };
}

function getCuratedSuggestions(term: string): LucknowSuggestion[] {
  const normalized = term.toLowerCase();
  const matches = POPULAR_LUCKNOW_LOCALITIES.filter((entry) => {
    if (!normalized) return true;
    const aliasMatch = entry.aliases?.some((alias) => alias.toLowerCase().includes(normalized));
    return (
      entry.label.toLowerCase().includes(normalized) ||
      entry.locality.toLowerCase().includes(normalized) ||
      entry.area?.toLowerCase().includes(normalized) ||
      entry.sector?.toLowerCase().includes(normalized) ||
      aliasMatch
    );
  })
    .slice(0, 8)
    .map((entry) => curatedEntryToSuggestion(entry));
  return matches;
}

function curatedEntryToSuggestion(entry: PopularLucknowLocality): LucknowSuggestion {
  return {
    id: `curated-${entry.label}`,
    label: entry.label,
    city: 'Lucknow', // Curated list is still Lucknow-specific
    locality: entry.locality,
    area: entry.area,
    sector: entry.sector,
    block: entry.block,
    road: entry.road,
    neighbourhood: entry.neighbourhood,
    pincode: entry.pincode,
    latitude: entry.latitude,
    longitude: entry.longitude,
    formattedAddress: entry.label,
    raw: { source: 'curated', label: entry.label },
  };
}

function mergeWithCurated(apiResults: LucknowSuggestion[], curated: LucknowSuggestion[]) {
  if (!apiResults.length) return curated;
  const existing = new Set(apiResults.map((item) => item.label.toLowerCase()));
  const curatedOnly = curated.filter((item) => !existing.has(item.label.toLowerCase()));
  return [...apiResults, ...curatedOnly];
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}


