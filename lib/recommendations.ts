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
}

async function fetchFallbackRecommendations(supabase: any, limit: number): Promise<RecommendedProperty[]> {
  const { data } = await supabase
    .from('properties')
    .select('id, title, price, rent, locality, city, property_type, for_sale, for_rent, provider, bedrooms, bathrooms')
    .neq('status', 'draft')
    .limit(limit)
    .order('created_at', { ascending: false });
  return data || [];
}

/**
 * Analyzes user history to find recommended properties.
 * Logic:
 * 1. Gather last 10 interactions from localStorage.
 * 2. Fetch their details to understand preferences.
 * 3. Weight: 'like'/'interest' = 3, 'view' = 1.
 * 4. Find properties in the same locality, type, or price range.
 * 5. Exclude already viewed properties.
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

  // Fetch details for historical properties to calculate weights
  const { data: historyDetails } = await supabase
    .from('properties')
    .select('id, locality, city, property_type, price, rent, for_sale, for_rent, bedrooms')
    .in('id', viewedIds)

  if (!historyDetails || historyDetails.length === 0) {
    // If no real properties in history, return fallback
    return fetchFallbackRecommendations(supabase, limit)
  }

  // Weighting & Frequency Map
  const preferences = {
    localities: {} as Record<string, number>,
    types: {} as Record<string, number>,
    cities: {} as Record<string, number>,
    bedrooms: {} as Record<number, number>,
  }

  history.forEach(item => {
    const detail = historyDetails.find(d => d.id === item.propertyId)
    if (!detail) return

    const weight = (item.lastAction === 'like' || item.lastAction === 'interest') ? 3 : 1
    
    if (detail.locality) preferences.localities[detail.locality] = (preferences.localities[detail.locality] || 0) + weight
    if (detail.property_type) preferences.types[detail.property_type] = (preferences.types[detail.property_type] || 0) + weight
    if (detail.city) preferences.cities[detail.city] = (preferences.cities[detail.city] || 0) + weight
    if (detail.bedrooms) preferences.bedrooms[detail.bedrooms] = (preferences.bedrooms[detail.bedrooms] || 0) + weight
  })

  // Get Top Preferences
  const topLocality = Object.entries(preferences.localities).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topType = Object.entries(preferences.types).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topCity = Object.entries(preferences.cities).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topBHK = Object.entries(preferences.bedrooms).sort((a, b) => b[1] - a[1])[0]?.[0]

  // Construct Recommendation Query
  // We'll search for properties matching Top Locality OR Top Type
  let query = supabase
    .from('properties')
    .select('id, title, price, rent, locality, city, property_type, for_sale, for_rent, provider, bedrooms, bathrooms')
    .neq('status', 'draft')

  if (viewedIds.length > 0) {
    query = query.not('id', 'in', `(${viewedIds.join(',')})`)
  }

  if (topLocality) {
    query = query.or(`locality.eq."${topLocality}",property_type.eq."${topType || ''}"`)
  } else if (topType) {
    query = query.eq('property_type', topType)
  }

  if (topCity) {
    query = query.eq('city', topCity)
  }

  const { data: recommendations, error } = await query
    .limit(limit * 2) // Fetch more to allow re-sorting
    .order('created_at', { ascending: false })

  if (error || !recommendations) return []

  // Score and Sort Recommendations
  const scored = recommendations.map(p => {
    let score = 0
    if (p.locality === topLocality) score += 5
    if (p.property_type === topType) score += 3
    if (p.bedrooms?.toString() === topBHK) score += 2
    return { ...p, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit) as RecommendedProperty[]
}
