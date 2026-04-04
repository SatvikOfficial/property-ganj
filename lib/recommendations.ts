import { createClient } from "@/utils/supabase/client"
import { getRecentlyViewed } from "./recently-viewed"

export interface RecommendedProperty {
  id: string
  title: string
  price: number
  rent?: number
  locality: string
  city: string
  property_type: string
  for_sale: boolean
  for_rent: boolean
  provider?: string
  bedrooms?: number
  bathrooms?: number
  carpet_area_sqft?: number
  matchScore?: number
  matchReasons?: string[]
}

async function fetchFallbackRecommendations(supabase: any, limit: number): Promise<RecommendedProperty[]> {
  const { data } = await supabase
    .from('properties')
    .select('id, title, price, rent, locality, city, property_type, for_sale, for_rent, provider, bedrooms, bathrooms, carpet_area_sqft')
    .neq('status', 'draft')
    .limit(limit)
    .order('created_at', { ascending: false });
  return data || [];
}

/**
 * AI-style recommendation engine for PropertyGanj.
 *
 * Analyses user's recently viewed / interacted-with properties and builds
 * a multi-dimensional preference profile then scores candidate properties.
 *
 * Factors weighted:
 *   - Location/locality   (strongest signal)
 *   - Property type match
 *   - Price band proximity
 *   - Area/space similarity
 *   - Bedroom count pref
 *   - Purpose match (sale vs rent)
 *   - Recency of interaction (more recent = higher weight)
 *   - Interaction type (like > interest > view)
 */
export async function getRecommendations(limit = 6): Promise<RecommendedProperty[]> {
  const history = getRecentlyViewed()
  const supabase = createClient()
  
  if (history.length === 0) {
    return fetchFallbackRecommendations(supabase, limit)
  }

  // Ensure we only query valid UUIDs (filter out local placeholders)
  const viewedIds = history.map(h => h.propertyId).filter(id => !id.startsWith('placeholder-') && !id.startsWith('featured-'))

  if (viewedIds.length === 0) {
    return fetchFallbackRecommendations(supabase, limit)
  }

  // Fetch details for historical properties
  const { data: historyDetails } = await supabase
    .from('properties')
    .select('id, locality, city, property_type, price, rent, for_sale, for_rent, bedrooms, carpet_area_sqft')
    .in('id', viewedIds)

  if (!historyDetails || historyDetails.length === 0) {
    return fetchFallbackRecommendations(supabase, limit)
  }

  // ─── Build Multi-Dimensional Preference Profile ───
  const actionWeights: Record<string, number> = { like: 5, interest: 4, view: 1, other: 1 }

  const preferences = {
    localities: {} as Record<string, number>,
    types: {} as Record<string, number>,
    cities: {} as Record<string, number>,
    bedrooms: {} as Record<number, number>,
    purposes: { sale: 0, rent: 0 },
    prices: [] as number[],
    areas: [] as number[],
  }

  history.forEach((item, index) => {
    const detail = historyDetails.find(d => d.id === item.propertyId)
    if (!detail) return

    // Recency factor: most recent items get higher weight (decays linearly)
    const recencyMultiplier = 1 + (history.length - index) / history.length
    const baseWeight = actionWeights[item.lastAction] || 1
    const weight = baseWeight * recencyMultiplier

    if (detail.locality) {
      preferences.localities[detail.locality] = (preferences.localities[detail.locality] || 0) + weight
    }
    if (detail.property_type) {
      preferences.types[detail.property_type] = (preferences.types[detail.property_type] || 0) + weight
    }
    if (detail.city) {
      preferences.cities[detail.city] = (preferences.cities[detail.city] || 0) + weight
    }
    if (detail.bedrooms) {
      preferences.bedrooms[detail.bedrooms] = (preferences.bedrooms[detail.bedrooms] || 0) + weight
    }
    // Purpose tracking
    if (detail.for_rent) preferences.purposes.rent += weight
    if (detail.for_sale) preferences.purposes.sale += weight

    // Price and area collection (for band matching)
    const effectivePrice = detail.for_rent ? (detail.rent || 0) : (detail.price || 0)
    if (effectivePrice > 0) preferences.prices.push(effectivePrice)
    if (detail.carpet_area_sqft && detail.carpet_area_sqft > 0) preferences.areas.push(detail.carpet_area_sqft)
  })

  // ─── Derive Top Preferences ───
  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])

  const topLocalities = sortDesc(preferences.localities).slice(0, 3).map(e => e[0])
  const topTypes = sortDesc(preferences.types).slice(0, 2).map(e => e[0])
  const topCity = sortDesc(preferences.cities)[0]?.[0]
  const topBHKs = Object.entries(preferences.bedrooms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(e => Number(e[0]))
  const preferredPurpose = preferences.purposes.sale >= preferences.purposes.rent ? 'sale' : 'rent'

  // Price band: compute median and acceptable range (±40%)
  const medianPrice = preferences.prices.length > 0
    ? preferences.prices.sort((a, b) => a - b)[Math.floor(preferences.prices.length / 2)]
    : 0
  const priceFloor = medianPrice * 0.6
  const priceCeil = medianPrice * 1.5

  // Area band: same approach
  const medianArea = preferences.areas.length > 0
    ? preferences.areas.sort((a, b) => a - b)[Math.floor(preferences.areas.length / 2)]
    : 0

  // ─── Fetch Candidate Properties ───
  let query = supabase
    .from('properties')
    .select('id, title, price, rent, locality, city, property_type, for_sale, for_rent, provider, bedrooms, bathrooms, carpet_area_sqft')
    .neq('status', 'draft')

  if (viewedIds.length > 0) {
    query = query.not('id', 'in', `(${viewedIds.join(',')})`)
  }

  // Build OR conditions for locality + type matching to cast a wider net
  const orClauses: string[] = []
  topLocalities.forEach(loc => orClauses.push(`locality.eq."${loc}"`))
  topTypes.forEach(t => orClauses.push(`property_type.eq."${t}"`))

  if (orClauses.length > 0) {
    query = query.or(orClauses.join(','))
  }

  if (topCity) {
    query = query.eq('city', topCity)
  }

  const { data: candidates, error } = await query
    .limit(limit * 4) // Fetch more to allow rich scoring
    .order('created_at', { ascending: false })

  if (error || !candidates || candidates.length === 0) {
    // Fallback: if no matches found with strict criteria, try broader search
    return fetchFallbackRecommendations(supabase, limit)
  }

  // ─── Multi-Factor Scoring ───
  const scored = candidates.map(p => {
    let score = 0
    const reasons: string[] = []

    // Location match (strongest signal, weight: 10)
    if (p.locality && topLocalities.includes(p.locality)) {
      const localityRank = topLocalities.indexOf(p.locality)
      const locationScore = (10 - localityRank * 2)
      score += locationScore
      reasons.push(`Near ${p.locality}`)
    }

    // Property type match (weight: 6)
    if (p.property_type && topTypes.includes(p.property_type)) {
      score += 6
      reasons.push(`${p.property_type} match`)
    }

    // Price band proximity (weight: 0-8)
    if (medianPrice > 0) {
      const effectivePrice = p.for_rent ? (p.rent || 0) : (p.price || 0)
      if (effectivePrice > 0) {
        if (effectivePrice >= priceFloor && effectivePrice <= priceCeil) {
          // Within comfortable range
          const proximity = 1 - Math.abs(effectivePrice - medianPrice) / medianPrice
          score += Math.round(proximity * 8)
          reasons.push('Budget fit')
        } else if (effectivePrice < priceFloor) {
          // Below range — slight bonus (good deal)
          score += 3
          reasons.push('Below budget')
        }
        // Above range → no bonus
      }
    }

    // Area/space similarity (weight: 0-5)
    if (medianArea > 0 && p.carpet_area_sqft && p.carpet_area_sqft > 0) {
      const areaRatio = p.carpet_area_sqft / medianArea
      if (areaRatio >= 0.7 && areaRatio <= 1.4) {
        const areaProximity = 1 - Math.abs(areaRatio - 1)
        score += Math.round(areaProximity * 5)
        reasons.push('Similar space')
      }
    }

    // BHK preference (weight: 4)
    if (p.bedrooms && topBHKs.includes(p.bedrooms)) {
      score += 4
      reasons.push(`${p.bedrooms} BHK`)
    }

    // Purpose match (weight: 3)
    if (preferredPurpose === 'rent' && p.for_rent) {
      score += 3
    } else if (preferredPurpose === 'sale' && p.for_sale) {
      score += 3
    }

    return { ...p, matchScore: score, matchReasons: reasons.slice(0, 3) } as RecommendedProperty
  })

  return scored
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, limit)
}
