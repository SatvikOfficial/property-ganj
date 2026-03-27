export const PROPERTY_GANJ_PREFIX = 'pg_listing'
export const PROPERTY_GANJ_DEFAULT_SUBDIVISION = 'flats-apartment' as const

export const PROPERTY_GANJ_SUBDIVISIONS = [
  {
    id: 'pg',
    label: 'PG',
    description: 'Paying guest rooms and co-living stays.',
  },
  {
    id: 'flats-apartment',
    label: 'Flats / Apartments',
    description: 'Curated apartments, flats, and ready-to-move units.',
  },
  {
    id: 'houses-villa',
    label: 'Houses / Villas',
    description: 'Independent homes, duplexes, and villas.',
  },
  {
    id: 'plot',
    label: 'Plot',
    description: 'Residential plots and development-ready land.',
  },
  {
    id: 'office',
    label: 'Office',
    description: 'Managed office suites and workspace inventory.',
  },
  {
    id: 'shop',
    label: 'Shop',
    description: 'Retail shops, showrooms, and storefronts.',
  },
  {
    id: 'commercial-land',
    label: 'Commercial Land',
    description: 'Commercial plots and land parcels.',
  },
] as const

export type PropertyGanjSubdivision = (typeof PROPERTY_GANJ_SUBDIVISIONS)[number]['id']

const subdivisionMeta = Object.fromEntries(
  PROPERTY_GANJ_SUBDIVISIONS.map((item) => [item.id, item]),
) as Record<PropertyGanjSubdivision, (typeof PROPERTY_GANJ_SUBDIVISIONS)[number]>

const normalizeText = (value?: string | null) => (value || '').trim().toLowerCase()

export const isFeaturedAddressLine2 = (value?: string | null) => value === 'featured'

export const isPropertyGanjAddressLine2 = (value?: string | null) =>
  value === PROPERTY_GANJ_PREFIX || value?.startsWith(`${PROPERTY_GANJ_PREFIX}:`) || false

export const makePropertyGanjAddressLine2 = (subdivision: PropertyGanjSubdivision) =>
  `${PROPERTY_GANJ_PREFIX}:${subdivision}`

export const getPropertyGanjSubdivisionMeta = (subdivision?: string | null) =>
  subdivisionMeta[subdivision as PropertyGanjSubdivision] ?? subdivisionMeta[PROPERTY_GANJ_DEFAULT_SUBDIVISION]

export function inferPropertyGanjSubdivision(input: {
  addressLine2?: string | null
  propertyType?: string | null
  title?: string | null
  type?: string | null
  description?: string | null
}): PropertyGanjSubdivision {
  const explicitAddress = normalizeText(input.addressLine2)
  if (explicitAddress.startsWith(`${PROPERTY_GANJ_PREFIX}:`)) {
    const explicitSubdivision = explicitAddress.slice(PROPERTY_GANJ_PREFIX.length + 1) as PropertyGanjSubdivision
    if (subdivisionMeta[explicitSubdivision]) return explicitSubdivision
  }

  const haystack = normalizeText(
    [input.propertyType, input.title, input.type, input.description].filter(Boolean).join(' '),
  )

  if (/\b(pg|paying guest|hostel|co-living|coliving)\b/.test(haystack)) return 'pg'
  if (/\b(shop|retail|showroom|store)\b/.test(haystack)) return 'shop'
  if (/\b(office|workspace|cowork|coworking|business center)\b/.test(haystack)) return 'office'
  if ((/\bcommercial\b/.test(haystack) && /\b(plot|land)\b/.test(haystack)) || /\bcommercial land\b/.test(haystack)) {
    return 'commercial-land'
  }
  if (/\b(villa|house|bungalow|duplex|row house|independent house)\b/.test(haystack)) return 'houses-villa'
  if (/\b(plot|land)\b/.test(haystack)) return 'plot'
  if (/\b(flat|apartment|studio|penthouse)\b/.test(haystack)) return 'flats-apartment'

  const propertyType = normalizeText(input.propertyType)
  if (propertyType.includes('commercial')) return 'office'
  if (propertyType.includes('house') || propertyType.includes('villa')) return 'houses-villa'
  if (propertyType.includes('land') || propertyType.includes('plot')) return 'plot'

  return PROPERTY_GANJ_DEFAULT_SUBDIVISION
}

export function getPropertyGanjSubdivisionFromProperty(input: {
  addressLine2?: string | null
  propertyType?: string | null
  title?: string | null
  type?: string | null
  description?: string | null
}) {
  if (!isPropertyGanjAddressLine2(input.addressLine2)) return null
  return inferPropertyGanjSubdivision(input)
}

export function getPropertyTypeFromListingForm(
  category: 'regular' | 'pg_listing',
  subdivision: PropertyGanjSubdivision,
  typeText?: string,
) {
  const normalizedType = normalizeText(typeText)

  if (category === 'pg_listing') {
    switch (subdivision) {
      case 'pg':
      case 'flats-apartment':
        return 'apartment'
      case 'houses-villa':
        return 'independent house/villa'
      case 'plot':
      case 'commercial-land':
        return 'plot/land'
      case 'office':
      case 'shop':
        return 'commercial'
      default:
        return 'apartment'
    }
  }

  if (normalizedType.includes('commercial')) return 'commercial'
  if (normalizedType.includes('house') || normalizedType.includes('villa')) return 'independent house/villa'
  if (normalizedType.includes('plot') || normalizedType.includes('land')) return 'plot/land'
  return 'apartment'
}
