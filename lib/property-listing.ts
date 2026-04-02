import {
  PROPERTY_GANJ_DEFAULT_SUBDIVISION,
  type PropertyGanjSubdivision,
  getPropertyGanjSubdivisionFromProperty,
  getPropertyGanjSubdivisionMeta,
  isPropertyGanjAddressLine2,
  makePropertyGanjAddressLine2,
} from '@/lib/property-ganj';
import { getCityByName } from '@/data/cityConfig';
import {
  resolvePropertyFloorplanBucket,
  resolvePropertyPhotoBucket,
} from '@/lib/property-media';

export type OwnerType = 'owner' | 'agent' | 'builder';
export type ListingPurpose = 'sale' | 'rent';

export type PhotoCategory =
  | 'siteView'
  | 'exterior'
  | 'commonArea'
  | 'livingRoom'
  | 'bedrooms'
  | 'bathrooms'
  | 'kitchen'
  | 'floorPlan'
  | 'other';

export type UploadedListingMedia = {
  bucket?: string | null;
  path?: string | null;
  url?: string | null;
  category?: PhotoCategory | null;
  label?: string | null;
  sortOrder?: number | null;
  isPrimary?: boolean | null;
};

export type UploadedListingFloorplan = {
  bucket?: string | null;
  path?: string | null;
  url?: string | null;
  label?: string | null;
  sortOrder?: number | null;
};

export type ListingLocationInput = {
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

export type ListingSpecsInput = {
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  carpetArea?: number;
  builtUpArea?: number;
  plotArea?: number;
  areaUnit?: string;
  floorNo?: number;
  totalFloors?: number;
  furnishing?: string;
  age?: string;
  facing?: string;
  parking?: number;
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

export type ListingContactInput = {
  name?: string;
  phone?: string;
  email?: string;
};

export type BuilderListingInput = {
  projectName?: string;
  unitLabel?: string;
  tower?: string;
  floorLabel?: string;
};

export type ListingSubmissionInput = {
  title: string;
  description?: string;
  purpose: ListingPurpose;
  ownerType?: OwnerType;
  propertyType: string;
  price?: number | null;
  rent?: number | null;
  maintenance?: number | null;
  deposit?: number | null;
  bookingAmount?: number | null;
  location?: ListingLocationInput;
  specs?: ListingSpecsInput;
  amenities?: string[];
  highlights?: string[];
  tags?: string[];
  videoUrl?: string;
  media?: {
    photos?: UploadedListingMedia[];
    floorplans?: UploadedListingFloorplan[];
  };
  contact?: ListingContactInput;
  builder?: BuilderListingInput;
  status?: 'draft' | 'published' | 'under_offer' | 'sold' | 'rented';
  listedByPropertyGanj?: boolean;
  subdivision?: PropertyGanjSubdivision;
  ownerUserId?: string;
  existingAddressLine2?: string | null;
  existingDescriptionRaw?: string | null;
};

export type ListingMetadata = {
  version: 1;
  ownerType?: OwnerType;
  location?: Omit<ListingLocationInput, 'city' | 'locality' | 'address'>;
  specs?: Omit<ListingSpecsInput, 'bedrooms' | 'bathrooms' | 'carpetArea' | 'builtUpArea' | 'furnishing' | 'parking'>;
  features?: {
    amenities?: string[];
    highlights?: string[];
    tags?: string[];
  };
  pricing?: {
    bookingAmount?: number | null;
  };
  media?: {
    videoUrl?: string;
  };
  contact?: ListingContactInput;
  builder?: BuilderListingInput;
  marketing?: {
    listedByPropertyGanj?: boolean;
    subdivision?: PropertyGanjSubdivision;
  };
  crm?: {
    interests?: PropertyInterestRecord[];
  };
};

export type PropertyInterestRecord = {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  source?: 'detail_callback' | 'admin';
};

export type DbPropertyImageRecord = {
  id?: string;
  property_id?: string;
  bucket?: string | null;
  path?: string | null;
  sort_order?: number | null;
  is_primary?: boolean | null;
  created_at?: string;
  size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  description?: string | null;
};

export type DbPropertyFloorplanRecord = {
  id?: string;
  property_id?: string;
  bucket?: string | null;
  path?: string | null;
  label?: string | null;
  sort_order?: number | null;
  created_at?: string;
};

export type DbPropertyRecord = {
  id: string;
  owner_user_id?: string | null;
  title: string;
  description?: string | null;
  property_type?: string | null;
  bhk?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;
  furnishing?: string | null;
  built_up_area_sqft?: number | null;
  carpet_area_sqft?: number | null;
  for_sale?: boolean | null;
  for_rent?: boolean | null;
  price?: number | null;
  rent?: number | null;
  maintenance?: number | null;
  deposit?: number | null;
  status?: string | null;
  slug?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  locality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  lat?: number | null;
  lng?: number | null;
  place_id?: string | null;
  provider?: string | null;
  formatted_address?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
  pg_id?: string | null;
  hold_by_user_id?: string | null;
  hold_expires_at?: string | null;
  property_images?: DbPropertyImageRecord[];
  property_floorplans?: DbPropertyFloorplanRecord[];
};

export type PropertyImageMeta = {
  category?: PhotoCategory;
  label?: string;
};

export const OWNER_TYPE_OPTIONS: { id: OwnerType; label: string; description: string }[] = [
  { id: 'owner', label: 'Owner', description: 'Direct owner listing' },
  { id: 'agent', label: 'Agent', description: 'Broker / consultant managed' },
  { id: 'builder', label: 'Builder', description: 'Developer or builder listing' },
];

export const PURPOSE_OPTIONS: { id: ListingPurpose; label: string; description: string }[] = [
  { id: 'sale', label: 'Sale', description: 'Outright sale / transfer' },
  { id: 'rent', label: 'Rent / Lease', description: 'Rental or lease inventory' },
];

export const PROPERTY_TYPE_OPTIONS = [
  'Apartment',
  'Independent House/Villa',
  'Plot/Land',
  'Studio',
  'Office Space',
  'Retail/Shop',
  'Warehouse',
  'Industrial',
] as const;

export const AREA_UNIT_OPTIONS = [
  { value: 'sqft', label: 'Sq-ft' },
  { value: 'sq-yrd', label: 'Sq-yrd' },
  { value: 'sqm', label: 'Sq-m' },
  { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'hectare', label: 'Hectare' },
] as const;

export const AMENITY_OPTIONS = [
  'Power Backup',
  'Lift',
  'Security',
  'Parking',
  'Gym',
  'Club House',
  'Swimming Pool',
  'Children Play Area',
  'Garden',
  'Intercom',
  'Fire Safety',
  'Visitor Parking',
  'Rainwater Harvesting',
  'CCTV',
] as const;

export const TAG_OPTIONS = [
  'New Launch',
  'Ready to Move',
  'Exclusive',
  'Luxury',
  'Budget Friendly',
  'Near Metro',
  'High Rental Yield',
  'Gated Community',
  'Corner Unit',
  'Family Friendly',
] as const;

export const PHOTO_CATEGORIES: { id: PhotoCategory; label: string; helper: string }[] = [
  { id: 'siteView', label: 'Site View', helper: 'Approach and frontage' },
  { id: 'exterior', label: 'Exterior', helper: 'Building elevation' },
  { id: 'commonArea', label: 'Common Area', helper: 'Amenities and lobby' },
  { id: 'livingRoom', label: 'Living Room', helper: 'Primary living space' },
  { id: 'bedrooms', label: 'Bedrooms', helper: 'Master and secondary rooms' },
  { id: 'bathrooms', label: 'Bathrooms', helper: 'Fittings and finishes' },
  { id: 'kitchen', label: 'Kitchen', helper: 'Storage and counters' },
  { id: 'floorPlan', label: 'Floor Plan', helper: 'Layout snapshots' },
  { id: 'other', label: 'Other', helper: 'Anything worth highlighting' },
];

export const LISTING_META_START = '[PG_META]';
export const LISTING_META_END = '[/PG_META]';

const compactArray = (values?: (string | undefined | null)[]) =>
  (values || []).map((value) => value?.trim()).filter((value): value is string => Boolean(value));

const normalizeText = (value?: string | null) => value?.trim() || undefined;
const normalizeComparable = (value?: string | null) => (value || '').trim().toLowerCase();

const normalizeNumber = (value?: number | null) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const normalizeBoolean = (value?: boolean | null) =>
  typeof value === 'boolean' ? value : undefined;

function inferPropertyCity(property: Pick<DbPropertyRecord, 'city' | 'formatted_address' | 'address_line1' | 'locality'>) {
  const explicitCity = normalizeText(property.city);
  if (explicitCity) return explicitCity;

  const normalizedLocality = normalizeComparable(property.locality);
  const addressCandidates = [property.formatted_address, property.address_line1];

  for (const candidate of addressCandidates) {
    const segments = (candidate || '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      const segment = segments[index];
      if (getCityByName(segment)) {
        return segment;
      }
    }

    for (let index = segments.length - 1; index >= 0; index -= 1) {
      const segment = segments[index];
      const normalizedSegment = normalizeComparable(segment);

      if (!normalizedSegment || normalizedSegment === normalizedLocality) continue;
      if (normalizedSegment === 'india') continue;
      if (/^\d{6}$/.test(segment)) continue;

      return segment;
    }
  }

  return undefined;
}

const normalizeInterestRecord = (record: PropertyInterestRecord) => ({
  userId: record.userId,
  name: record.name.trim(),
  phone: record.phone.trim(),
  email: record.email?.trim() || undefined,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  source: record.source,
});

export function normalizeListingPropertyType(value?: string | null) {
  const normalized = (value || '').trim().toLowerCase();
  if (normalized.includes('plot') || normalized.includes('land')) return 'land';
  if (normalized.includes('house') || normalized.includes('villa')) return 'house';
  if (normalized.includes('office')) return 'office';
  if (normalized.includes('retail') || normalized.includes('shop')) return 'shop';
  if (normalized.includes('warehouse')) return 'warehouse';
  if (normalized.includes('industrial')) return 'industrial';
  if (normalized.includes('studio')) return 'studio';
  return 'apartment';
}

export function prettifyPropertyType(value?: string | null) {
  const normalized = normalizeListingPropertyType(value);
  switch (normalized) {
    case 'land':
      return 'Plot / Land';
    case 'house':
      return 'Independent House / Villa';
    case 'office':
      return 'Office Space';
    case 'shop':
      return 'Retail / Shop';
    case 'warehouse':
      return 'Warehouse';
    case 'industrial':
      return 'Industrial';
    case 'studio':
      return 'Studio';
    default:
      return 'Apartment';
  }
}

export function isLandProperty(value?: string | null) {
  return normalizeListingPropertyType(value) === 'land';
}

export function makePropertyReference(propertyId?: string | null, pgId?: string | null) {
  if (pgId?.trim()) return pgId.trim();
  if (!propertyId) return 'PG-LISTING';
  return `PG-${propertyId.slice(0, 8).toUpperCase()}`;
}

export function buildPublicStorageUrl(bucket?: string | null, path?: string | null) {
  if (!path) return null;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('/')) {
    return path;
  }
  if (!bucket) return path;

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return path;
  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function serializeImageDescription(meta: PropertyImageMeta) {
  const payload = {
    category: meta.category || undefined,
    label: meta.label || undefined,
  };
  if (!payload.category && !payload.label) return null;
  return JSON.stringify(payload);
}

export function parseImageDescription(value?: string | null): PropertyImageMeta {
  if (!value?.trim()) return {};
  try {
    const parsed = JSON.parse(value) as PropertyImageMeta;
    return {
      category: parsed.category,
      label: parsed.label,
    };
  } catch {
    return { label: value };
  }
}

export function serializeListingDescription(
  plainDescription: string | undefined,
  metadata?: ListingMetadata | null,
) {
  const base = plainDescription?.trim() || '';
  if (!metadata) return base || null;

  const compactMetadata = JSON.stringify(metadata);
  if (!compactMetadata || compactMetadata === '{}') return base || null;

  return [base, LISTING_META_START, compactMetadata, LISTING_META_END]
    .filter(Boolean)
    .join('\n\n');
}

export function parseListingDescription(raw?: string | null) {
  if (!raw) {
    return { description: '', metadata: null as ListingMetadata | null };
  }

  const startIndex = raw.indexOf(LISTING_META_START);
  const endIndex = raw.indexOf(LISTING_META_END);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return { description: raw.trim(), metadata: null as ListingMetadata | null };
  }

  const description = raw.slice(0, startIndex).trim();
  const metadataSlice = raw
    .slice(startIndex + LISTING_META_START.length, endIndex)
    .trim();

  try {
    const metadata = JSON.parse(metadataSlice) as ListingMetadata;
    return { description, metadata };
  } catch {
    return { description: raw.trim(), metadata: null as ListingMetadata | null };
  }
}

export function extractListingMetadataFromProperty(property: DbPropertyRecord) {
  const parsed = parseListingDescription(property.description);
  const inferredSubdivision = getPropertyGanjSubdivisionFromProperty({
    addressLine2: property.address_line2,
    propertyType: property.property_type,
    title: property.title,
    description: parsed.description,
  }) ?? undefined;

  const listedByPropertyGanj = isPropertyGanjAddressLine2(property.address_line2);

  const metadata: ListingMetadata = {
    version: 1,
    ...(parsed.metadata || {}),
    marketing: {
      listedByPropertyGanj,
      subdivision:
        parsed.metadata?.marketing?.subdivision ||
        inferredSubdivision ||
        (listedByPropertyGanj ? PROPERTY_GANJ_DEFAULT_SUBDIVISION : undefined),
    },
  };

  return {
    description: parsed.description,
    metadata,
  };
}

export function buildPropertyMutationFromListing(input: ListingSubmissionInput) {
  const propertyType = normalizeListingPropertyType(input.propertyType);
  const isRent = input.purpose === 'rent';
  const photos = (input.media?.photos || []).filter((photo) => photo.path || photo.url);
  const floorplans = (input.media?.floorplans || []).filter((plan) => plan.path || plan.url);
  const existingMetadata = input.existingDescriptionRaw
    ? parseListingDescription(input.existingDescriptionRaw).metadata
    : null;

  const metadata: ListingMetadata = {
    version: 1,
    ownerType: input.ownerType,
    location: {
      area: normalizeText(input.location?.area),
      sector: normalizeText(input.location?.sector),
      block: normalizeText(input.location?.block),
      road: normalizeText(input.location?.road),
      landmark: normalizeText(input.location?.landmark),
      pincode: normalizeText(input.location?.pincode),
      latitude: normalizeNumber(input.location?.latitude),
      longitude: normalizeNumber(input.location?.longitude),
      placeId: normalizeText(input.location?.placeId),
      geoSource: input.location?.geoSource,
    },
    specs: {
      balconies: normalizeNumber(input.specs?.balconies),
      plotArea: normalizeNumber(input.specs?.plotArea),
      areaUnit: normalizeText(input.specs?.areaUnit),
      floorNo: normalizeNumber(input.specs?.floorNo),
      totalFloors: normalizeNumber(input.specs?.totalFloors),
      age: normalizeText(input.specs?.age),
      facing: normalizeText(input.specs?.facing),
      possessionStatus: normalizeText(input.specs?.possessionStatus),
      availableFrom: normalizeText(input.specs?.availableFrom),
      noOfOpenSides: normalizeNumber(input.specs?.noOfOpenSides),
      widthOfRoadFacing: normalizeNumber(input.specs?.widthOfRoadFacing),
      anyConstructionDone: normalizeBoolean(input.specs?.anyConstructionDone),
      boundaryWallMade: normalizeBoolean(input.specs?.boundaryWallMade),
      isInGatedColony: normalizeBoolean(input.specs?.isInGatedColony),
      isCornerPlot: normalizeBoolean(input.specs?.isCornerPlot),
      floorsAllowedForConstruction: normalizeNumber(input.specs?.floorsAllowedForConstruction),
    },
    features: {
      amenities: compactArray(input.amenities),
      highlights: compactArray(input.highlights),
      tags: compactArray(input.tags),
    },
    pricing: {
      bookingAmount: normalizeNumber(input.bookingAmount),
    },
    media: {
      videoUrl: normalizeText(input.videoUrl),
    },
    contact: {
      name: normalizeText(input.contact?.name),
      phone: normalizeText(input.contact?.phone),
      email: normalizeText(input.contact?.email),
    },
    builder: {
      projectName: normalizeText(input.builder?.projectName) || existingMetadata?.builder?.projectName,
      unitLabel: normalizeText(input.builder?.unitLabel) || existingMetadata?.builder?.unitLabel,
      tower: normalizeText(input.builder?.tower) || existingMetadata?.builder?.tower,
      floorLabel: normalizeText(input.builder?.floorLabel) || existingMetadata?.builder?.floorLabel,
    },
    marketing: {
      listedByPropertyGanj: Boolean(input.listedByPropertyGanj),
      subdivision: input.listedByPropertyGanj
        ? input.subdivision || PROPERTY_GANJ_DEFAULT_SUBDIVISION
        : undefined,
    },
    crm: existingMetadata?.crm,
  };

  const addressLine2 = input.listedByPropertyGanj
    ? makePropertyGanjAddressLine2(input.subdivision || PROPERTY_GANJ_DEFAULT_SUBDIVISION)
    : input.existingAddressLine2 || null;

  const primaryPhoto = photos.find((photo) => photo.isPrimary) || photos[0];
  const providerUrl = primaryPhoto
    ? buildPublicStorageUrl(primaryPhoto.bucket, primaryPhoto.path) || primaryPhoto.url || null
    : null;

  const propertyPayload = {
    owner_user_id: input.ownerUserId,
    title: input.title.trim(),
    description: serializeListingDescription(input.description, metadata),
    property_type: propertyType,
    bhk: normalizeNumber(input.specs?.bedrooms),
    bedrooms: normalizeNumber(input.specs?.bedrooms),
    bathrooms: normalizeNumber(input.specs?.bathrooms),
    parking: normalizeNumber(input.specs?.parking),
    furnishing: normalizeText(input.specs?.furnishing),
    built_up_area_sqft: normalizeNumber(input.specs?.builtUpArea),
    carpet_area_sqft: normalizeNumber(input.specs?.carpetArea),
    for_sale: !isRent,
    for_rent: isRent,
    price: !isRent ? normalizeNumber(input.price) ?? null : null,
    rent: isRent ? normalizeNumber(input.rent ?? input.price) ?? null : null,
    maintenance: normalizeNumber(input.maintenance) ?? null,
    deposit: normalizeNumber(input.deposit) ?? null,
    status: input.status || 'published',
    address_line1: normalizeText(input.location?.address) ?? null,
    address_line2: addressLine2,
    locality: normalizeText(input.location?.locality) ?? null,
    city: normalizeText(input.location?.city) ?? 'Lucknow',
    state: null,
    country: 'India',
    postal_code: normalizeText(input.location?.pincode) ?? null,
    lat: normalizeNumber(input.location?.latitude) ?? null,
    lng: normalizeNumber(input.location?.longitude) ?? null,
    place_id: normalizeText(input.location?.placeId) ?? null,
    provider: providerUrl,
    formatted_address:
      compactArray([
        input.location?.address,
        input.location?.locality,
        input.location?.city,
      ]).join(', ') || null,
    published_at: input.status === 'published' ? new Date().toISOString() : null,
  };

  const propertyImages = photos.map((photo, index) => ({
    bucket:
      photo.bucket ||
      (photo.path && !photo.path.startsWith('http') ? resolvePropertyPhotoBucket() : 'external'),
    path: photo.path || photo.url || '',
    sort_order: photo.sortOrder ?? index,
    is_primary: Boolean(photo.isPrimary ?? index === 0),
    description: serializeImageDescription({
      category: photo.category || undefined,
      label: photo.label || undefined,
    }),
  }));

  const propertyFloorplans = floorplans.map((floorplan, index) => ({
    bucket:
      floorplan.bucket ||
      (floorplan.path && !floorplan.path.startsWith('http') ? resolvePropertyFloorplanBucket() : 'external'),
    path: floorplan.path || floorplan.url || '',
    label: floorplan.label || `Floor plan ${index + 1}`,
    sort_order: floorplan.sortOrder ?? index,
  }));

  return {
    propertyPayload,
    propertyImages,
    propertyFloorplans,
    metadata,
  };
}

export function mapDbPropertyForDetail(
  property: DbPropertyRecord,
  ownerProfile?: {
    full_name?: string | null;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null,
) {
  const { description, metadata } = extractListingMetadataFromProperty(property);
  const imageRows = [...(property.property_images || [])].sort(
    (left, right) => (left.sort_order || 0) - (right.sort_order || 0),
  );
  const floorplanRows = [...(property.property_floorplans || [])].sort(
    (left, right) => (left.sort_order || 0) - (right.sort_order || 0),
  );

  const gallery = imageRows.map((image, index) => {
    const imageMeta = parseImageDescription(image.description);
    return {
      id: image.id || `${property.id}-image-${index}`,
      url:
        buildPublicStorageUrl(image.bucket, image.path) ||
        property.provider ||
        '/placeholder.svg',
      category: imageMeta.category || undefined,
      label: imageMeta.label || PHOTO_CATEGORIES.find((item) => item.id === imageMeta.category)?.label,
      isPrimary: Boolean(image.is_primary),
    };
  });

  if (gallery.length === 0) {
    gallery.push({
      id: `${property.id}-fallback-image`,
      url: property.provider || '/placeholder.svg',
      category: 'exterior',
      label: 'Listing image',
      isPrimary: true,
    });
  }

  const floorplans = floorplanRows.map((plan, index) => ({
    id: plan.id || `${property.id}-floorplan-${index}`,
    url: buildPublicStorageUrl(plan.bucket, plan.path) || '/placeholder.svg',
    label: plan.label || `Floor plan ${index + 1}`,
  }));

  const listedByPropertyGanj = Boolean(metadata.marketing?.listedByPropertyGanj);
  const ownerRole = listedByPropertyGanj ? 'property-ganj' : ownerProfile?.role || metadata.ownerType || 'owner';
  const purpose: ListingPurpose = property.for_rent ? 'rent' : 'sale';
  const price = property.for_rent ? property.rent : property.price;
  const listingId = makePropertyReference(property.id, property.pg_id);
  const inferredCity = inferPropertyCity(property);
  const subdivisionMeta = metadata.marketing?.subdivision
    ? getPropertyGanjSubdivisionMeta(metadata.marketing.subdivision)
    : null;

  return {
    id: property.id,
    listingId,
    title: property.title,
    description,
    price: price ?? 0,
    currency: 'INR',
    purpose,
    propertyType: prettifyPropertyType(property.property_type),
    dbPropertyType: normalizeListingPropertyType(property.property_type),
    status: property.status || 'published',
    listedBy: listedByPropertyGanj ? 'Property Ganj' : ownerProfile?.full_name || 'Verified lister',
    listedByRole: ownerRole,
    propertyGanjSubdivision: subdivisionMeta?.label,
    location: {
      city: inferredCity,
      locality: property.locality || undefined,
      area: metadata.location?.area,
      sector: metadata.location?.sector,
      block: metadata.location?.block,
      road: metadata.location?.road,
      address: property.formatted_address || property.address_line1 || undefined,
      landmark: metadata.location?.landmark,
      pincode: property.postal_code || metadata.location?.pincode,
      latitude: property.lat ?? metadata.location?.latitude,
      longitude: property.lng ?? metadata.location?.longitude,
    },
    specs: {
      bedrooms: property.bedrooms ?? undefined,
      bathrooms: property.bathrooms ?? undefined,
      balconies: metadata.specs?.balconies,
      parking: property.parking ?? undefined,
      carpetArea: property.carpet_area_sqft ?? undefined,
      builtUpArea: property.built_up_area_sqft ?? undefined,
      plotArea: metadata.specs?.plotArea,
      areaUnit: metadata.specs?.areaUnit || 'sqft',
      furnishing: property.furnishing || undefined,
      floorNo: metadata.specs?.floorNo,
      totalFloors: metadata.specs?.totalFloors,
      age: metadata.specs?.age,
      facing: metadata.specs?.facing,
      possessionStatus: metadata.specs?.possessionStatus,
      availableFrom: metadata.specs?.availableFrom,
      noOfOpenSides: metadata.specs?.noOfOpenSides,
      widthOfRoadFacing: metadata.specs?.widthOfRoadFacing,
      anyConstructionDone: metadata.specs?.anyConstructionDone,
      boundaryWallMade: metadata.specs?.boundaryWallMade,
      isInGatedColony: metadata.specs?.isInGatedColony,
      isCornerPlot: metadata.specs?.isCornerPlot,
      floorsAllowedForConstruction: metadata.specs?.floorsAllowedForConstruction,
    },
    pricing: {
      maintenance: property.maintenance ?? undefined,
      deposit: property.deposit ?? undefined,
      bookingAmount: metadata.pricing?.bookingAmount ?? undefined,
    },
    amenities: metadata.features?.amenities || [],
    highlights: metadata.features?.highlights || [],
    tags: metadata.features?.tags || [],
    media: {
      photos: gallery,
      floorplans,
      videoUrl: metadata.media?.videoUrl,
    },
    owner: {
      name: ownerProfile?.full_name || metadata.contact?.name || 'Property Ganj',
      phone: undefined,
      email: undefined,
      ownerType: metadata.ownerType || (ownerProfile?.role as OwnerType | undefined) || 'owner',
    },
    hold: {
      byUserId: property.hold_by_user_id || undefined,
      expiresAt: property.hold_expires_at || undefined,
    },
    createdAt: property.created_at || undefined,
    updatedAt: property.updated_at || undefined,
    publishedAt: property.published_at || undefined,
  };
}

export function getPropertyInterestRecords(property: Pick<DbPropertyRecord, 'description'>) {
  const { metadata } = parseListingDescription(property.description);
  const interests = metadata?.crm?.interests || [];

  return interests
    .map((interest) => normalizeInterestRecord(interest))
    .filter((interest) => interest.userId && interest.name && interest.phone)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function hasPropertyInterestFromUser(
  property: Pick<DbPropertyRecord, 'description'>,
  userId?: string | null,
) {
  if (!userId) return false;
  return getPropertyInterestRecords(property).some((interest) => interest.userId === userId);
}

export function buildPropertyDescriptionWithInterest(
  property: Pick<DbPropertyRecord, 'description'>,
  interest: {
    userId: string;
    name: string;
    phone: string;
    email?: string;
    source?: 'detail_callback' | 'admin';
  },
) {
  const { description, metadata } = extractListingMetadataFromProperty(property as DbPropertyRecord);
  const interests = getPropertyInterestRecords(property);
  const existing = interests.find((item) => item.userId === interest.userId);
  const now = new Date().toISOString();

  const nextInterest = normalizeInterestRecord({
    userId: interest.userId,
    name: interest.name,
    phone: interest.phone,
    email: interest.email,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    source: interest.source || existing?.source || 'detail_callback',
  });

  const nextInterests = [
    nextInterest,
    ...interests.filter((item) => item.userId !== interest.userId),
  ];

  return serializeListingDescription(description, {
    ...metadata,
    crm: {
      ...(metadata.crm || {}),
      interests: nextInterests,
    },
  });
}

export function extractInterestLeadsFromProperty(property: DbPropertyRecord) {
  return getPropertyInterestRecords(property).map((interest) => ({
    id: `${property.id}:${interest.userId}`,
    kind: 'interest' as const,
    user_id: interest.userId,
    name: interest.name,
    email: interest.email,
    phone: interest.phone,
    status: 'interest',
    property_id: property.id,
    property_title: property.title,
    created_at: interest.createdAt,
    updated_at: interest.updatedAt,
    assigned_agent_id: property.hold_by_user_id || undefined,
    assigned_agent_expires_at: property.hold_expires_at || undefined,
    message: `Callback requested for "${property.title}"${property.locality ? ` · ${property.locality}` : ''}`,
  }));
}
