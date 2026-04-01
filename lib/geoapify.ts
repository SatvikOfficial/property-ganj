import { getCityByName } from '@/data/cityConfig';

type CuratedLocalityRecord = {
  label: string;
  locality: string;
  area?: string;
  sector?: string;
  block?: string;
  road?: string;
  neighbourhood?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  aliases?: string[];
};

export type ResolvedLocation = {
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
  placeId?: string;
  resultType?: string;
  raw?: Record<string, unknown>;
};

export type LocationLookupInput = {
  city?: string;
  locality?: string;
  area?: string;
  sector?: string;
  block?: string;
  road?: string;
  address?: string;
  pincode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  geoSource?: 'geoapify' | 'manual';
};

function normalizeText(value?: string | null) {
  return value?.trim() || undefined;
}

function normalizeComparable(value?: string | null) {
  return (value || '').trim().toLowerCase();
}

function getFeatureCoordinates(feature: any) {
  if (Array.isArray(feature?.geometry?.coordinates)) {
    return {
      latitude: Number(feature.geometry.coordinates[1]) || undefined,
      longitude: Number(feature.geometry.coordinates[0]) || undefined,
    };
  }

  if (feature?.properties?.lat !== undefined && feature?.properties?.lon !== undefined) {
    return {
      latitude: Number(feature.properties.lat) || undefined,
      longitude: Number(feature.properties.lon) || undefined,
    };
  }

  if (feature?.lat !== undefined && feature?.lon !== undefined) {
    return {
      latitude: Number(feature.lat) || undefined,
      longitude: Number(feature.lon) || undefined,
    };
  }

  return { latitude: undefined, longitude: undefined };
}

export function buildLocationQuery(parts: Array<string | undefined | null>) {
  return parts
    .map((part) => normalizeText(part))
    .filter((part): part is string => Boolean(part))
    .join(', ');
}

export function buildLocationSearchText(location: LocationLookupInput) {
  return buildLocationQuery([
    location.address,
    location.road,
    location.block,
    location.sector,
    location.locality,
    location.area,
    location.landmark,
    location.city,
    location.pincode,
    'India',
  ]);
}

export function buildGoogleMapsEmbedUrl(query: string) {
  const normalized = normalizeText(query);
  if (!normalized) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(normalized)}&z=15&output=embed`;
}

export function buildGoogleMapsSearchUrl(query: string) {
  const normalized = normalizeText(query);
  if (!normalized) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
}

export function buildGeoapifyStaticMapUrl({
  latitude,
  longitude,
  apiKey,
  width = 1200,
  height = 620,
  zoom = 15,
}: {
  latitude?: number;
  longitude?: number;
  apiKey?: string;
  width?: number;
  height?: number;
  zoom?: number;
}) {
  if (
    !apiKey ||
    latitude === undefined ||
    longitude === undefined ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    return null;
  }

  const marker = encodeURIComponent(
    `lonlat:${longitude},${latitude};type:material;color:%23eb6239;icon:home;size:56;whitecircle:no;shadow:no;strokecolor:%23ffffff`
  );

  return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${width}&height=${height}&center=lonlat:${longitude},${latitude}&zoom=${zoom}&marker=${marker}&apiKey=${apiKey}`;
}

export function transformGeoapifyFeature(
  feature: any,
  fallbackCity?: string,
): ResolvedLocation | null {
  const properties = feature?.properties || feature;
  if (!properties) return null;

  const { latitude, longitude } = getFeatureCoordinates(feature);

  const locality =
    properties.suburb ||
    properties.quarter ||
    properties.neighbourhood ||
    properties.city_block ||
    properties.city_district ||
    properties.district;

  const area =
    properties.district ||
    properties.county ||
    properties.borough ||
    properties.suburb ||
    properties.state_district;

  const sector = properties.city_block || properties.quarter;
  const block = properties.neighbourhood || properties.block;
  const road = properties.street || properties.road;
  const city =
    properties.city ||
    properties.town ||
    properties.village ||
    properties.county ||
    fallbackCity ||
    '';

  const label =
    properties.name ||
    properties.address_line1 ||
    properties.formatted ||
    buildLocationQuery([locality, area, city]) ||
    city;

  if (!label) return null;

  return {
    label,
    city,
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
    placeId: String(properties.place_id || properties.osm_id || ''),
    resultType: properties.result_type,
    raw: properties,
  };
}

export function lookupCuratedLocality(
  cityName?: string,
  localityTerm?: string,
): ResolvedLocation | null {
  const normalizedCity = normalizeText(cityName);
  const normalizedTerm = normalizeComparable(localityTerm);

  if (!normalizedCity || !normalizedTerm) return null;

  const city = getCityByName(normalizedCity);
  if (!city) return null;

  const match = (city.localities as CuratedLocalityRecord[]).find((entry) => {
    const terms = [
      entry.label,
      entry.locality,
      entry.area,
      entry.sector,
      entry.block,
      entry.road,
      entry.neighbourhood,
      entry.pincode,
      ...(entry.aliases || []),
    ]
      .map((value) => normalizeComparable(value))
      .filter(Boolean);

    return terms.some((term) => term === normalizedTerm);
  });

  if (!match) return null;

  return {
    label: match.label,
    city: city.name,
    locality: match.locality,
    area: match.area,
    sector: match.sector,
    block: match.block,
    road: match.road,
    neighbourhood: match.neighbourhood,
    pincode: match.pincode,
    latitude: match.latitude,
    longitude: match.longitude,
    formattedAddress: buildLocationQuery([match.label, city.name]),
    raw: { source: 'curated', label: match.label },
  };
}

export async function geocodeLocation(
  location: LocationLookupInput,
  apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
): Promise<ResolvedLocation | null> {
  if (
    location.latitude !== undefined &&
    location.longitude !== undefined &&
    !Number.isNaN(location.latitude) &&
    !Number.isNaN(location.longitude)
  ) {
    return {
      label: buildLocationQuery([location.locality, location.city]) || location.city || 'Selected location',
      city: location.city || '',
      locality: location.locality,
      area: location.area,
      sector: location.sector,
      block: location.block,
      road: location.road,
      pincode: location.pincode,
      latitude: location.latitude,
      longitude: location.longitude,
      formattedAddress: buildLocationQuery([location.address, location.locality, location.city]),
    };
  }

  const curated =
    lookupCuratedLocality(location.city, location.locality) ||
    lookupCuratedLocality(location.city, location.area) ||
    lookupCuratedLocality(location.city, location.sector);

  if (curated?.latitude !== undefined && curated.longitude !== undefined) {
    return {
      ...curated,
      formattedAddress:
        buildLocationQuery([location.address, curated.locality, location.city || curated.city]) ||
        curated.formattedAddress,
    };
  }

  if (!apiKey) return curated || null;

  const queryText = buildLocationSearchText(location);
  if (!queryText) return curated || null;

  const city = getCityByName(location.city || '');
  const params = new URLSearchParams({
    text: queryText,
    limit: '1',
    lang: 'en',
    apiKey,
  });

  if (city?.boundingBox) {
    params.set('filter', city.boundingBox);
  }

  if (city?.centroid) {
    params.set('bias', `proximity:${city.centroid.lon},${city.centroid.lat}`);
  }

  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return curated || null;
    }

    const data = await response.json();
    const feature = Array.isArray(data?.features) ? data.features[0] : null;
    const resolved = transformGeoapifyFeature(feature, location.city);

    if (!resolved) return curated || null;

    return {
      ...resolved,
      city: resolved.city || location.city || '',
      locality: resolved.locality || location.locality,
      area: resolved.area || location.area,
      sector: resolved.sector || location.sector,
      block: resolved.block || location.block,
      road: resolved.road || location.road,
      pincode: resolved.pincode || location.pincode,
      formattedAddress:
        resolved.formattedAddress ||
        buildLocationQuery([location.address, location.locality, location.city]),
    };
  } catch {
    return curated || null;
  }
}

export async function hydrateLocationInput(
  location?: LocationLookupInput,
): Promise<LocationLookupInput | undefined> {
  if (!location) return location;

  const resolved = await geocodeLocation(location);
  if (!resolved) return location;

  return {
    ...location,
    city: normalizeText(location.city) || resolved.city || location.city,
    locality: normalizeText(location.locality) || resolved.locality || resolved.area || resolved.label,
    area: normalizeText(location.area) || resolved.area,
    sector: normalizeText(location.sector) || resolved.sector,
    block: normalizeText(location.block) || resolved.block,
    road: normalizeText(location.road) || resolved.road,
    address: normalizeText(location.address) || resolved.formattedAddress,
    pincode: normalizeText(location.pincode) || resolved.pincode,
    latitude:
      location.latitude !== undefined && !Number.isNaN(location.latitude)
        ? location.latitude
        : resolved.latitude,
    longitude:
      location.longitude !== undefined && !Number.isNaN(location.longitude)
        ? location.longitude
        : resolved.longitude,
    placeId: normalizeText(location.placeId) || resolved.placeId,
    geoSource: location.geoSource || (resolved.placeId ? 'geoapify' : location.geoSource),
  };
}
