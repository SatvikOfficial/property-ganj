"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, X, Share2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import LikeButton from "@/components/LikeButton"
import LucknowLocationAutocomplete, { ResolvedLucknowLocation } from "@/components/location/LucknowLocationAutocomplete"
import { createClient } from "@/utils/supabase/client"
import { useCity } from "@/components/CityContext"
import {
  buildGeoapifyStaticMapUrl,
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsSearchUrl,
} from "@/lib/geoapify"

const propertyTypeOptions = ["Apartment", "Independent House/Villa", "Plot/Land", "Office", "Retail"]
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"]
const postedByOptions = ["all", "owner", "builder", "agent"]
const tagOptions = ["Furnished", "Semi-Furnished", "Unfurnished", "Ready to Move", "Under Construction", "Near Metro", "Gated Community", "Parking", "Lift", "Power Backup", "Swimming Pool", "Gym", "Garden", "Security", "Pet Friendly"]
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "area-low", label: "Area: Low to High" },
  { value: "area-high", label: "Area: High to Low" },
]

type SearchFiltersState = {
  purpose: "sale" | "rent"
  location: string
  locality?: string
  propertyTypes: string[]
  budgetMin?: number
  budgetMax?: number
  bhk: string[]
  ownerType: string
  tags: string[]
  sortBy: string
  lat?: number
  lng?: number
}
const parseBudgetInput = (value: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase().replace(/,/g, "")
  if (!normalized) return undefined
  if (normalized.endsWith("cr")) {
    return Math.round(Number(normalized.replace("cr", "")) * 10000000)
  }
  if (normalized.endsWith("lac") || normalized.endsWith("l")) {
    return Math.round(Number(normalized.replace(/lac|l/g, "")) * 100000)
  }
  const numeric = Number(normalized)
  return Number.isNaN(numeric) ? undefined : numeric
}

const formatCurrency = (value?: number) => {
  if (!value) return "₹ —"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatBudgetSummary = (min?: number, max?: number) => {
  if (min !== undefined && max !== undefined) return `${formatCurrency(min)} - ${formatCurrency(max)}`
  if (min !== undefined) return `${formatCurrency(min)}+`
  if (max !== undefined) return `Up to ${formatCurrency(max)}`
  return "Open budget"
}

function SearchFiltersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cityConfig } = useCity()

  const initialLocation = searchParams.get("q") || ""
  const [filters, setFilters] = useState<SearchFiltersState>(() => ({
    purpose: searchParams.get("purpose") === "rent" ? "rent" : "sale",
    location: initialLocation,
    locality: searchParams.get("locality") || undefined,
    propertyTypes: searchParams.get("propertyType")?.split(",").filter(Boolean) || [],
    budgetMin: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    budgetMax: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    bhk: searchParams.get("bedrooms") ? [`${searchParams.get("bedrooms")} BHK`] : [],
    ownerType: searchParams.get("ownerType") || "all",
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy") || "newest",
    lat: searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined,
    lng: searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined,
  }))
  const [locationQuery, setLocationQuery] = useState(initialLocation)

  const [properties, setProperties] = useState<any[]>([])
  const [likedProperties, setLikedProperties] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false)
  const [showBhkModal, setShowBhkModal] = useState(false)
  const [showPostedByModal, setShowPostedByModal] = useState(false)
  const [showTagsModal, setShowTagsModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [tempBudgetMin, setTempBudgetMin] = useState(filters.budgetMin ? `${filters.budgetMin}` : "")
  const [tempBudgetMax, setTempBudgetMax] = useState(filters.budgetMax ? `${filters.budgetMax}` : "")
  const selectedLocationLabel = filters.location || locationQuery || filters.locality || cityConfig.name
  const hasPreciseLocationFocus = filters.lat !== undefined && filters.lng !== undefined
  const selectedLocationMapUrl = buildGeoapifyStaticMapUrl({
    latitude: filters.lat,
    longitude: filters.lng,
    apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
    width: 900,
    height: 520,
    zoom: filters.lat !== undefined && filters.lng !== undefined ? 14 : 11,
  })
  const selectedLocationEmbedUrl = buildGoogleMapsEmbedUrl(selectedLocationLabel)
  const selectedLocationSearchUrl = buildGoogleMapsSearchUrl(selectedLocationLabel)
  const budgetSummary = formatBudgetSummary(filters.budgetMin, filters.budgetMax)
  const propertyTypeSummary = filters.propertyTypes.length ? filters.propertyTypes.join(", ") : "Any property type"
  const bhkSummary = filters.bhk.length ? filters.bhk.join(", ") : "Any configuration"
  const ownerSummary = filters.ownerType === "all" ? "Owner, builder, and agent" : filters.ownerType
  const tagSummary = filters.tags.length ? filters.tags.join(", ") : "No lifestyle filters applied"
  const sortSummary = sortOptions.find((option) => option.value === filters.sortBy)?.label || "Newest First"

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowBudgetModal(false)
        setShowPropertyTypeModal(false)
        setShowBhkModal(false)
        setShowPostedByModal(false)
        setShowTagsModal(false)
        setShowSortModal(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleModal = (setter: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
    setShowBudgetModal(false)
    setShowPropertyTypeModal(false)
    setShowBhkModal(false)
    setShowPostedByModal(false)
    setShowTagsModal(false)
    setShowSortModal(false)
    if (!currentState) setter(true)
  }

  const handleLocationFilterChange = (value: string) => {
    setLocationQuery(value)
    const trimmed = value.trim()
    if (!trimmed) {
      setFilters((prev) => ({ ...prev, location: "", locality: undefined, lat: undefined, lng: undefined }))
      return
    }
    if (trimmed.length >= 2) {
      setFilters((prev) => ({ ...prev, location: trimmed, locality: trimmed, lat: undefined, lng: undefined }))
    }
  }

  const handleLocationFilterSelect = (resolved: ResolvedLucknowLocation) => {
    setLocationQuery(resolved.label)
    setFilters((prev) => ({
      ...prev,
      location: resolved.label,
      locality: resolved.locality || resolved.area || resolved.label,
      lat: resolved.latitude,
      lng: resolved.longitude,
    }))
  }

  const buildQuery = (state = filters) => {
    const params = new URLSearchParams()
    params.set("purpose", state.purpose as string)
    if (state.location) params.set("q", state.location)
    params.set("city", cityConfig.name)
    if (state.locality) params.set("locality", state.locality)
    if (state.propertyTypes.length) params.set("propertyType", state.propertyTypes.join(","))
    if (state.budgetMin) params.set("minPrice", String(state.budgetMin))
    if (state.budgetMax) params.set("maxPrice", String(state.budgetMax))
    if (state.ownerType !== "all") params.set("ownerType", state.ownerType)
    if (state.bhk.length === 1) {
      const value = parseInt(state.bhk[0], 10)
      if (!Number.isNaN(value)) params.set("bedrooms", String(value))
    }
    if (state.tags.length) params.set("tags", state.tags.join(","))
    if (state.sortBy) params.set("sortBy", state.sortBy)
    if (state.lat !== undefined && !Number.isNaN(state.lat)) params.set("lat", String(state.lat))
    if (state.lng !== undefined && !Number.isNaN(state.lng)) params.set("lng", String(state.lng))
    return params
  }

  const fetchProperties = async (params: URLSearchParams) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/properties?${params.toString()}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load listings.")
      }

      const nextProperties = Array.isArray(data.properties) ? data.properties : []
      setProperties(nextProperties)
      setTotalCount(typeof data.count === "number" ? data.count : nextProperties.length)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || nextProperties.length === 0) {
        setLikedProperties([])
        return
      }

      const propertyIds = nextProperties.map((property: any) => property._id).filter(Boolean)
      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select("property_id")
        .eq("user_id", user.id)
        .in("property_id", propertyIds)

      if (likesError) {
        setLikedProperties([])
        return
      }

      setLikedProperties((likes || []).map((like: any) => like.property_id))
    } catch (fetchError) {
      setProperties([])
      setLikedProperties([])
      setTotalCount(0)
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load listings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLikedProperties([])
  }, [])

  useEffect(() => {
    const params = buildQuery()
    router.replace(`/search?${params.toString()}`, { scroll: false })
    fetchProperties(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const removeBudgetFilter = () => {
    setFilters((prev) => ({ ...prev, budgetMin: undefined, budgetMax: undefined }))
    setTempBudgetMin("")
    setTempBudgetMax("")
  }

  const applyBudgetFilter = () => {
    const min = parseBudgetInput(tempBudgetMin)
    const max = parseBudgetInput(tempBudgetMax)
    setFilters((prev) => ({ ...prev, budgetMin: min, budgetMax: max }))
    setShowBudgetModal(false)
  }

  const clearAllFilters = () => {
    setLocationQuery("")
    setTempBudgetMin("")
    setTempBudgetMax("")
    setFilters((prev) => ({
      purpose: prev.purpose,
      location: "",
      locality: undefined,
      propertyTypes: [],
      budgetMin: undefined,
      budgetMax: undefined,
      bhk: [],
      ownerType: "all",
      tags: [],
      sortBy: "newest",
      lat: undefined,
      lng: undefined,
    }))
  }

  const togglePropertyType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((item) => item !== type)
        : [...prev.propertyTypes, type],
    }))
  }

  const toggleBhk = (bhk: string) => {
    setFilters((prev) => ({
      ...prev,
      bhk: prev.bhk.includes(bhk) ? prev.bhk.filter((item) => item !== bhk) : [...prev.bhk, bhk],
    }))
  }

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }))
  }

  const removeTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }))
  }

  return (
    <>
      <div className="bg-card px-4 py-3 md:py-4 sticky top-[73px] z-40 shadow-sm" ref={filterRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, purpose: prev.purpose === "rent" ? "sale" : "rent" }))}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary/90 active:bg-primary/80 flex items-center gap-1 touch-manipulation"
            >
              {filters.purpose === "rent" ? "Rent" : "Buy"} <ChevronDown className="w-4 h-4" />
            </button>

            <div className="w-full md:w-72 flex-1 min-w-[250px]">
              <LucknowLocationAutocomplete
                value={locationQuery}
                onChange={handleLocationFilterChange}
                onSelect={handleLocationFilterSelect}
                showDetectButton
                dense
                className="w-full"
              />
            </div>

            {filters.location && (
              <div className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm max-w-[220px] truncate">
                {filters.location}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => toggleModal(setShowBudgetModal, showBudgetModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-2"
              >
                {filters.budgetMin ? formatCurrency(filters.budgetMin) : "Min Budget"} -{" "}
                {filters.budgetMax ? formatCurrency(filters.budgetMax) : "Max Budget"}
                {(filters.budgetMin || filters.budgetMax) && (
                  <X className="w-4 h-4 cursor-pointer" onClick={removeBudgetFilter} />
                )}
              </button>

              {showBudgetModal && (
                <div className="absolute top-full md:top-12 left-0 bg-background rounded-lg shadow-xl p-4 md:p-6 w-full md:w-80 z-50 border border-border mt-2 md:mt-0 max-h-[80vh] overflow-y-auto">
                  <p className="text-sm font-semibold text-foreground mb-4">Set your budget range</p>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Min (₹)</label>
                      <input
                        type="text"
                        value={tempBudgetMin}
                        onChange={(e) => setTempBudgetMin(e.target.value)}
                        className="border border-border rounded px-2 py-2 w-full text-sm bg-background"
                        placeholder="50L"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Max (₹)</label>
                      <input
                        type="text"
                        value={tempBudgetMax}
                        onChange={(e) => setTempBudgetMax(e.target.value)}
                        className="border border-border rounded px-2 py-2 w-full text-sm bg-background"
                        placeholder="1.5Cr"
                      />
                    </div>
                  </div>
                  <button
                    onClick={applyBudgetFilter}
                    className="w-full flex items-center justify-center text-white border-none rounded transition-all group"
                    style={{
                      background: "linear-gradient(to right, #eb6239, #d6522f)",
                      padding: "0.8em 1.3em 0.8em 0.9em",
                      fontSize: "17px",
                      fontWeight: "500",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <svg height="18" width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0.5 group-hover:rotate-90">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" />
                    </svg>
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0.5">
                      Done
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleModal(setShowPropertyTypeModal, showPropertyTypeModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1"
              >
                Property Type <ChevronDown className="w-4 h-4" />
              </button>

              {showPropertyTypeModal && (
                <div className="absolute top-full md:top-12 left-0 bg-background rounded-lg shadow-xl p-4 w-full md:w-48 z-50 border border-border mt-2 md:mt-0 max-h-[60vh] overflow-y-auto">
                  {propertyTypeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted px-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type)}
                        onChange={() => togglePropertyType(type)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleModal(setShowBhkModal, showBhkModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1"
              >
                BHK <ChevronDown className="w-4 h-4" />
              </button>

              {showBhkModal && (
                <div className="absolute top-full md:top-12 left-0 bg-background rounded-lg shadow-xl p-4 w-full md:w-40 z-50 border border-border mt-2 md:mt-0 max-h-[60vh] overflow-y-auto">
                  {bhkOptions.map((bhk) => (
                    <label
                      key={bhk}
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted px-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filters.bhk.includes(bhk)}
                        onChange={() => toggleBhk(bhk)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-foreground">{bhk}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleModal(setShowPostedByModal, showPostedByModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1 capitalize"
              >
                {filters.ownerType === "all" ? "Posted By" : `Posted: ${filters.ownerType}`}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showPostedByModal && (
                <div className="absolute top-full md:top-12 left-0 bg-background rounded-lg shadow-xl p-4 w-full md:w-40 z-50 border border-border mt-2 md:mt-0 max-h-[60vh] overflow-y-auto">
                  {postedByOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, ownerType: option }))
                        setShowPostedByModal(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm capitalize ${
                        filters.ownerType === option ? "bg-muted font-semibold" : "hover:bg-muted"
                      }`}
                    >
                      {option === "all" ? "All" : option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleModal(setShowTagsModal, showTagsModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1"
              >
                Tags {filters.tags.length > 0 && `(${filters.tags.length})`} <ChevronDown className="w-4 h-4" />
              </button>
              {showTagsModal && (
                <div className="absolute top-full md:top-12 left-0 bg-background rounded-lg shadow-xl p-4 w-full md:w-64 z-50 border border-border max-h-[60vh] overflow-y-auto mt-2 md:mt-0">
                  <p className="text-sm font-semibold text-foreground mb-3">Select Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          filters.tags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleModal(setShowSortModal, showSortModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1"
              >
                Sort: {sortOptions.find((s) => s.value === filters.sortBy)?.label || "Newest First"} <ChevronDown className="w-4 h-4" />
              </button>
              {showSortModal && (
                <div className="absolute top-full md:top-12 right-0 bg-background rounded-lg shadow-xl p-4 w-full md:w-56 z-50 border border-border mt-2 md:mt-0 max-h-[60vh] overflow-y-auto">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, sortBy: option.value }))
                        setShowSortModal(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filters.sortBy === option.value ? "bg-muted font-semibold" : "hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tags Display */}
      <div data-filters-section></div>
      {filters.tags.length > 0 && (
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground font-semibold">Active Tags:</span>
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-primary/80 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-muted-foreground font-semibold text-lg mb-6">
              {loading ? "Loading properties..." : `Showing ${totalCount} matching properties`}
            </h2>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="space-y-4">
              {!loading && properties.length === 0 && (
                <div className="bg-card border border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-foreground font-semibold mb-2">No properties found</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
              {properties.map((property) => {
                const area = property.specs?.carpetArea || property.specs?.builtUpArea
                const sqftPrice = area ? `₹${Math.round(property.price / area)}/sqft` : ""
                const bedrooms = property.specs?.bedrooms ? `${property.specs.bedrooms} BHK` : property.propertyType
                const location = [property.location?.locality, property.location?.city].filter(Boolean).join(", ")
                const image = property.media?.photos?.[0]?.url || "/placeholder.svg"
                const isLiked = likedProperties.includes(property._id)
                const distanceLabel = typeof property.distanceKm === "number" ? `${property.distanceKm} km away` : null

                return (
                  <div
                    key={property._id}
                    className="group overflow-hidden rounded-[24px] border border-[#eadcca] bg-white/95 shadow-[0_18px_36px_-28px_rgba(31,42,46,0.38)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_-26px_rgba(31,42,46,0.26)]"
                  >
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-5">
                      <div className="relative h-52 w-full overflow-hidden rounded-[18px] bg-muted md:h-[170px] md:w-[220px] md:flex-shrink-0">
                        <img
                          src={image}
                          alt={property.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 left-2 bg-foreground/80 text-background px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                          {property.media?.photos?.length || 0} Photos
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <LikeButton propertyId={property._id} initialLiked={isLiked} />
                          <button className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/86 p-2 shadow-[0_16px_34px_-24px_rgba(31,42,46,0.42)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
                            <Share2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#fff3ed] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#eb6239]">
                              {property.purpose === "rent" ? "For rent" : "For sale"}
                            </span>
                            <span className="rounded-full border border-[#eadcca] bg-[#fffaf5] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1f2a2e]">
                              {property.propertyType}
                            </span>
                            {distanceLabel && (
                              <span className="rounded-full border border-[#d9e4de] bg-[#f1f8f4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f6f4f]">
                                {distanceLabel}
                              </span>
                            )}
                          </div>
                          <Link href={`/property/${property._id}`}>
                            <h3 className="mt-3 text-xl font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                              {property.title}
                            </h3>
                          </Link>
                          <p className="mt-2 text-sm text-muted-foreground">{location}</p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">
                            {property.description?.slice(0, 180) || "Owner has not provided additional description yet."}
                          </p>
                        </div>

                        <div className="grid gap-3 rounded-[18px] bg-[#faf6f1] p-3 md:grid-cols-4">
                          <div className="text-xs">
                            <span className="text-muted-foreground block">CONFIGURATION</span>
                            <span className="font-semibold text-foreground">{bedrooms}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground block">AREA</span>
                            <span className="font-semibold text-foreground">
                              {area ? `${area} ${property.specs?.areaUnit || "sqft"}` : "—"}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground block">RATE</span>
                            <span className="font-semibold text-foreground">
                              {sqftPrice || "On request"}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground block">STATUS</span>
                            <span className="font-semibold text-foreground">
                              {property.purpose === "rent" ? "For Rent" : "For Sale"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center font-bold text-secondary">
                            {(property.listedBy || "P").charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">
                              {property.ownerType === "property-ganj" ? "property ganj managed" : `${property.ownerType} listed`}
                            </p>
                            <p className="font-semibold text-foreground">
                              {property.listedBy === "Property Ganj" ? "Property Ganj" : "Verified lister"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between md:w-[170px] md:flex-shrink-0">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9ca3af] md:text-right">
                            {property.purpose === "rent" ? "Monthly rent" : "Quoted price"}
                          </p>
                          <p className="mt-2 text-2xl font-black text-foreground md:text-right">
                            {formatCurrency(property.price)}
                          </p>
                          {sqftPrice && <p className="text-sm text-muted-foreground md:text-right">{sqftPrice}</p>}
                        </div>
                        <div className="mt-4 space-y-2 w-full md:mt-6">
                          <Link 
                            href={`/property/${property._id}`}
                            className="block w-full rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground touch-manipulation hover:bg-primary/90 active:bg-primary/80"
                          >
                            View Details
                          </Link>
                          <Link 
                            href={`/property/${property._id}`}
                            className="block w-full rounded-full border-2 border-primary py-2.5 text-center text-sm font-semibold text-primary touch-manipulation hover:bg-primary/10 active:bg-primary/20"
                          >
                            Request Callback
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              {selectedLocationLabel && (
                <div className="overflow-hidden rounded-[24px] border border-[#eadcca] bg-white shadow-[0_18px_42px_-30px_rgba(31,42,46,0.3)]">
                  <div className="border-b border-[#eadcca] px-5 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Search focus</p>
                    <h3 className="mt-2 text-lg font-black tracking-tight text-[#1f2a2e]">{selectedLocationLabel}</h3>
                    <p className="mt-1 text-sm text-[#667085]">
                      {hasPreciseLocationFocus
                        ? "Listings are being surfaced around this point first, so nearby options show up before the rest of the city."
                        : "Pick a locality suggestion to turn this into a proper map-led search instead of a broad city browse."}
                    </p>
                  </div>
                  <div className="bg-[#f8f4ef]">
                    {selectedLocationMapUrl ? (
                      <img
                        src={selectedLocationMapUrl}
                        alt={`Map for ${selectedLocationLabel}`}
                        className="h-[220px] w-full object-cover"
                        loading="lazy"
                      />
                    ) : selectedLocationEmbedUrl ? (
                      <iframe
                        src={selectedLocationEmbedUrl}
                        title={`Map for ${selectedLocationLabel}`}
                        className="h-[220px] w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : null}
                  </div>
                  {selectedLocationSearchUrl && (
                    <div className="px-5 py-4">
                      <a
                        href={selectedLocationSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
                      >
                        Open area in Google Maps
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="overflow-hidden rounded-[24px] border border-[#eadcca] bg-white shadow-[0_18px_42px_-30px_rgba(31,42,46,0.24)]">
                <div className="border-b border-[#eadcca] px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Search snapshot</p>
                  <h3 className="mt-2 text-lg font-black tracking-tight text-[#1f2a2e]">What this shortlist is optimized for</h3>
                </div>
                <div className="grid gap-3 px-5 py-5">
                  <div className="rounded-2xl bg-[#f8f4ef] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Budget</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">{budgetSummary}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f4ef] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Property type</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">{propertyTypeSummary}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f4ef] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Configuration</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">{bhkSummary}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f4ef] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Listed by</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-[#1f2a2e]">{ownerSummary}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f4ef] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Tags</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">{tagSummary}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f4ef] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Sort</p>
                    <p className="mt-1 text-sm font-semibold text-[#1f2a2e]">{sortSummary}</p>
                  </div>
                </div>
                <div className="border-t border-[#eadcca] px-5 py-4">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
                  >
                    Reset search filters
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-dashed border-[#d9c6ae] bg-[#fffaf4] px-5 py-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af]">Shortlisting tip</p>
                <h3 className="mt-2 text-lg font-black tracking-tight text-[#1f2a2e]">Compare the right signals</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Prioritize carpet area, furnishing, possession status, and the distance badge when you are browsing locality-led results.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  The closer cards are to your selected map focus, the more useful the comparison becomes for actual site visits.
                </p>
                <div className="mt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
                  >
                    Learn how Property Ganj verifies listings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <SearchFiltersContent />
      </Suspense>
    </main>
  )
}
