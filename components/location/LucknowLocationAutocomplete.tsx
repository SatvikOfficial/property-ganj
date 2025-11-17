'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, LocateFixed, MapPin, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { POPULAR_LUCKNOW_LOCALITIES, PopularLucknowLocality } from '@/data/lucknowLocalities';

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

const CITY_NAME = 'Lucknow';
const CITY_CENTROID = { lat: 26.8467, lon: 80.9462 };
const BOUNDING_BOX = 'rect:80.7506,26.7002,81.1104,27.1502'; // lon,lat order as required by Geoapify

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
  placeholder = 'Search Lucknow localities, sectors, roads…',
  className,
  inputClassName,
  dense = false,
  showDetectButton = false,
  disabled = false,
}: LucknowLocationAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const [suggestions, setSuggestions] = useState<LucknowSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedValue = useDebouncedValue(value, 250);
  const trimmedValue = (debouncedValue || '').trim();
  const curatedSuggestions = useMemo(
    () => getCuratedSuggestions(trimmedValue),
    [trimmedValue]
  );

  useEffect(() => {
    if (!apiKey) {
      setError('Geoapify API key missing. Add NEXT_PUBLIC_GEOAPIFY_API_KEY in your env file.');
      setSuggestions(curatedSuggestions);
      setHighlightIndex(curatedSuggestions.length ? 0 : -1);
      return;
    }
    setError(null);
  }, [apiKey, curatedSuggestions]);

  useEffect(() => {
    const shouldSkipGeo = !apiKey || trimmedValue.length < 2 || trimmedValue.toLowerCase() === CITY_NAME.toLowerCase();
    if (shouldSkipGeo) {
      setSuggestions(curatedSuggestions);
      setHighlightIndex(curatedSuggestions.length ? 0 : -1);
      setLoading(false);
      if (!curatedSuggestions.length) {
        setError('No Lucknow matches found');
      } else {
        setError(null);
      }
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
          filter: BOUNDING_BOX,
          bias: `proximity:${CITY_CENTROID.lon},${CITY_CENTROID.lat}`,
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
        setError(combined.length ? null : 'No Lucknow matches found');
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Geoapify autocomplete error', err);
        const combined = curatedSuggestions;
        setSuggestions(combined);
        setHighlightIndex(combined.length ? 0 : -1);
        setError(combined.length ? null : 'Unable to fetch suggestions right now.');
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
    if (!apiKey || !navigator.geolocation) {
      setError('Geolocation not available in this browser.');
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
          const suggestion = data.features?.[0] ? transformFeatureToSuggestion(data.features[0]) : null;
          if (suggestion && suggestion.city.toLowerCase().includes(CITY_NAME.toLowerCase())) {
            handleSelect(suggestion);
          } else {
            setError('Current location is outside Lucknow. Please pick a Lucknow address.');
          }
        } catch (err) {
          console.error('Reverse geocoding failed', err);
          setError('Unable to detect a Lucknow address from your GPS fix.');
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        console.error('Geolocation error', geoError);
        setError(geoError.message || 'Unable to read your GPS location.');
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
            <LocateFixed className="h-5 w-5" />
            <span className="sr-only">Use current location</span>
          </button>
        )}
      </div>
      {suggestionList}
      {!apiKey && <GeoapifyWarning message="Geoapify key missing. Update your .env file to enable smart search." />}
      {!!error && apiKey && !loading && (
        <p className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function transformFeatureToSuggestion(feature: any): LucknowSuggestion | null {
  if (!feature?.properties) return null;
  const { properties, geometry } = feature;
  const latitude = geometry?.coordinates?.[1];
  const longitude = geometry?.coordinates?.[0];
  const cityName = (properties.city || properties.county || '').toLowerCase();

  if (!cityName.includes(CITY_NAME.toLowerCase())) {
    return null;
  }

  const locality =
    properties.suburb ||
    properties.quarter ||
    properties.neighbourhood ||
    properties.city_block ||
    properties.city_district;

  const area = properties.district || properties.borough || properties.suburb;

  const sector = properties.city_block || properties.quarter;
  const block = properties.neighbourhood || properties.block;
  const road = properties.street || properties.road;
  const label =
    properties.name ||
    properties.address_line1 ||
    properties.formatted ||
    [locality, area, CITY_NAME].filter(Boolean).join(', ');

  return {
    id: String(properties.place_id || properties.osm_id || `${latitude}-${longitude}`),
    label,
    city: properties.city || CITY_NAME,
    locality: locality || properties.name,
    area,
    sector,
    block,
    road,
    neighbourhood: properties.neighbourhood || properties.quarter,
    pincode: properties.postcode,
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
    city: CITY_NAME,
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


