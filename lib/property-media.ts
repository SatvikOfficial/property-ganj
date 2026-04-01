const DEPRECATED_MEDIA_BUCKET = 'property-media';

export const DEFAULT_PROPERTY_PHOTO_BUCKET = 'property-photos';
export const DEFAULT_PROPERTY_FLOORPLAN_BUCKET = 'property-floorplans';

function normalizeConfiguredBucket(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized || normalized === DEPRECATED_MEDIA_BUCKET) {
    return null;
  }
  return normalized;
}

export function resolvePropertyPhotoBucket() {
  return (
    normalizeConfiguredBucket(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET) ||
    DEFAULT_PROPERTY_PHOTO_BUCKET
  );
}

export function resolvePropertyFloorplanBucket() {
  return (
    normalizeConfiguredBucket(process.env.NEXT_PUBLIC_SUPABASE_FLOORPLAN_STORAGE_BUCKET) ||
    DEFAULT_PROPERTY_FLOORPLAN_BUCKET
  );
}

export function resolvePropertyMediaBucket(category?: string | null) {
  const normalizedCategory = (category || '').trim().toLowerCase();
  if (normalizedCategory.includes('floor')) {
    return resolvePropertyFloorplanBucket();
  }
  return resolvePropertyPhotoBucket();
}
