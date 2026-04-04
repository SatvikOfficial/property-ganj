"use client"

import { useMemo, useState, useEffect } from "react"
import { ChevronDown, Search, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import LucknowLocationAutocomplete, { ResolvedLucknowLocation } from "@/components/location/LucknowLocationAutocomplete"
import { useRouter } from "next/navigation"
import { useCity } from "@/components/CityContext"

type PropertyTypeItem = {
  label: string
  value: string
}

type PropertyGroup = {
  title: string
  items: PropertyTypeItem[]
}

type SearchBarProps = {
  defaultLocation?: string
  activeFilter?: string
}

const propertyTypeGroups: PropertyGroup[] = [
  {
    title: "Residential",
    items: [
      { label: "Flat", value: "Apartment" },
      { label: "House/Villa", value: "Independent House/Villa" },
      { label: "Plot", value: "Plot/Land" },
    ],
  },
  {
    title: "Commercial",
    items: [
      { label: "Office Space", value: "Office Space" },
      { label: "Shop/Showroom", value: "Retail/Shop" },
      { label: "Commercial Land", value: "Commercial Land" },
      { label: "Warehouse/Godown", value: "Warehouse" },
      { label: "Industrial Building", value: "Industrial Building" },
      { label: "Industrial Shed", value: "Industrial Shed" },
    ],
  },
  {
    title: "Other Property Types",
    items: [
      { label: "Agricultural Land", value: "Agricultural Land" },
      { label: "Farm House", value: "Farm House" },
    ],
  },
]

const bhkOptions = [1, 2, 3, 4, 5, 6] // 6 represents 5+ BHK

const normalizeFilter = (label?: string) => {
  const value = (label || "buy").toLowerCase()
  if (value.includes("rent")) return "rental"
  if (value.includes("project")) return "projects"
  if (value === "pg") return "pg"
  if (value.includes("plot")) return "plot"
  if (value.includes("commercial")) return "commercial"
  return "buy"
}

const getBudgetRanges = (filter: string) => {
  switch (filter) {
    case "rental":
      return {
        min: [5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
        max: [5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
      }
    case "projects":
      return {
        min: [10, 20, 30, 40, 50, 75, 100, 200, 300, 400],
        max: [10, 20, 30, 40, 50, 75, 100, 200, 300, 400],
      }
    case "pg":
      return {
        min: [5, 10, 15, 20, 25, 30, 40, 50],
        max: [5, 10, 15, 20, 25, 30, 40, 50],
      }
    case "plot":
    case "commercial":
    case "buy":
    default:
      return {
        min: [5, 10, 20, 30, 40, 50, 75, 100, 200, 500, 750, 1000, 2000, 7500],
        max: [5, 10, 20, 30, 40, 50, 75, 100, 200, 500, 750, 1000, 2000, 7500],
      }
  }
}

const formatBudgetValue = (value: number, filter: string) => {
  if (filter === "pg") {
    return `${value}K`
  }
  if (value >= 1000) {
    return `${value / 1000} Cr`
  }
  return `${value} L`
}

const convertBudgetToRupees = (value: number, filter: string) => {
  if (filter === "pg") {
    return value * 1000
  }
  return value * 100000
}

const getBudgetDisplayText = (minValue: number | null, maxValue: number | null, filter: string) => {
  if (!minValue && !maxValue) return "Budget"
  if (minValue && maxValue) {
    return `₹${formatBudgetValue(minValue, filter)} - ₹${formatBudgetValue(maxValue, filter)}`
  }
  if (minValue) return `Above ₹${formatBudgetValue(minValue, filter)}`
  if (maxValue) return `Upto ₹${formatBudgetValue(maxValue, filter)}`
  return "Budget"
}

export default function SearchBar({ defaultLocation, activeFilter = "Buy" }: SearchBarProps) {
  const router = useRouter()
  const { cityConfig } = useCity()
  const normalizedFilter = normalizeFilter(activeFilter)

  const [location, setLocation] = useState(defaultLocation || "")
  const [resolvedLocation, setResolvedLocation] = useState<ResolvedLucknowLocation | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [selectedBedroom, setSelectedBedroom] = useState<number | null>(null)
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false)
  const [selectedMinBudget, setSelectedMinBudget] = useState<number | null>(null)
  const [selectedMaxBudget, setSelectedMaxBudget] = useState<number | null>(null)

  const closeSheets = () => {
    setShowPropertyDropdown(false)
    setShowBudgetDropdown(false)
  }

  const isSheetOpen = showPropertyDropdown || showBudgetDropdown

  useEffect(() => {
    if (!isSheetOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (target.closest('.property-dropdown') || target.closest('.budget-dropdown')) {
        return
      }

      if (target.closest('.property-type-button') || target.closest('.budget-button')) {
        return
      }

      if (!target.closest('.search-bar-container')) {
        closeSheets()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPropertyDropdown, showBudgetDropdown])

  // Scroll locking has been removed to allow the page to be scrollable when dropdowns are open.
  // This ensures the full dropdown can be seen on smaller desktop screens or when zoomed in.

  const handleLocationInputChange = (text: string) => {
    setLocation(text)
    setResolvedLocation(null)
  }

  const handleResolvedLocation = (resolved: ResolvedLucknowLocation) => {
    setLocation(resolved.label)
    setResolvedLocation(resolved)
  }

  const togglePropertyType = (value: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const propertySummary = useMemo(() => {
    if (selectedPropertyTypes.length === 0) return "Property Type"
    const first = selectedPropertyTypes[0]
    const labelMap: Record<string, string> = {}
    propertyTypeGroups.forEach((group) =>
      group.items.forEach((item) => {
        labelMap[item.value] = item.label
      })
    )
    const firstLabel = labelMap[first] || first
    if (selectedPropertyTypes.length === 1) return firstLabel
    return `${firstLabel} +${selectedPropertyTypes.length - 1}`
  }, [selectedPropertyTypes])

  const handleSearch = () => {
    const params = new URLSearchParams()
    const trimmedLocation = location.trim() || cityConfig.name
    params.set("q", trimmedLocation)

    if (resolvedLocation?.locality) {
      params.set("locality", resolvedLocation.locality)
    }
    params.set("city", cityConfig.name)
    if (resolvedLocation?.latitude && resolvedLocation?.longitude) {
      params.set("lat", resolvedLocation.latitude.toString())
      params.set("lng", resolvedLocation.longitude.toString())
    }

    const purpose = normalizedFilter === "rental" || normalizedFilter === "pg" ? "rent" : "sale"
    params.set("purpose", purpose)

    if (selectedPropertyTypes.length) {
      params.set("propertyType", selectedPropertyTypes.join(","))
    }

    if (selectedBedroom) {
      const bedroomsValue = selectedBedroom === 6 ? 5 : selectedBedroom
      params.set("bedrooms", String(bedroomsValue))
    }

    if (selectedMinBudget) {
      params.set("minPrice", String(convertBudgetToRupees(selectedMinBudget, normalizedFilter)))
    }

    if (selectedMaxBudget) {
      params.set("maxPrice", String(convertBudgetToRupees(selectedMaxBudget, normalizedFilter)))
    }

    closeSheets()
    router.push(`/search?${params.toString()}`)
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in your browser")
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setLocation(transcript)
      setResolvedLocation(null)
    }
    recognition.start()
  }

  const renderPropertyDropdown = () => (
    <div
      data-open={showPropertyDropdown}
      className="property-dropdown pg-mobile-sheet z-50 opacity-0 pointer-events-none data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto md:absolute md:left-1/2 md:top-[calc(100%+0.75rem)] md:w-[360px] md:-translate-x-1/2 md:translate-y-2 md:rounded-[26px] md:border md:border-border md:bg-white md:p-4 md:shadow-[0_28px_56px_-34px_rgba(15,23,42,0.28)] md:data-[open=true]:translate-y-0"
    >
      <div className="px-4 pb-5 pt-2 md:p-0">
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Property Type</p>
          <p className="mt-1 text-sm text-muted-foreground">Pick a property category and preferred configuration.</p>
        </div>

        {propertyTypeGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => togglePropertyType(item.value)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-all ${
                    selectedPropertyTypes.includes(item.value)
                      ? "border-[#eb6239] bg-[#fff1eb] text-[#eb6239] shadow-[inset_0_0_0_1px_rgba(235,98,57,0.1)]"
                      : "border-border text-foreground hover:border-[#eb6239]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Bedrooms</p>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedBedroom((prev) => (prev === option ? null : option))}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-all ${
                  selectedBedroom === option
                    ? "border-[#eb6239] bg-[#fff1eb] text-[#eb6239] shadow-[inset_0_0_0_1px_rgba(235,98,57,0.1)]"
                    : "border-border text-foreground hover:border-[#eb6239]"
                }`}
              >
                {option === 6 ? "5+ BHK" : `${option} BHK`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderBudgetDropdown = () => {
    const { min, max } = getBudgetRanges(normalizedFilter)
    const isInvalid = selectedMinBudget !== null && selectedMaxBudget !== null && selectedMaxBudget < selectedMinBudget

    return (
      <div
        data-open={showBudgetDropdown}
        className="budget-dropdown pg-mobile-sheet z-50 opacity-0 pointer-events-none data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto md:absolute md:right-0 md:top-[calc(100%+0.75rem)] md:w-[360px] md:translate-y-2 md:rounded-[26px] md:border md:border-border md:bg-white md:p-4 md:shadow-[0_28px_56px_-34px_rgba(15,23,42,0.28)] md:data-[open=true]:translate-y-0"
      >
        <div className="px-4 pb-5 pt-2 md:p-0">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Budget</p>
            <p className="mt-1 text-sm text-muted-foreground">Slide into the right price band before you jump into listings.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Min Price</p>
              <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                {min.map((value) => (
                  <button
                    key={`min-${value}`}
                    type="button"
                    onClick={() => setSelectedMinBudget(value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedMinBudget === value
                        ? "border-[#eb6239] bg-[#fff1eb] text-[#eb6239]"
                        : "border-border text-foreground hover:border-[#eb6239]"
                    }`}
                  >
                    ₹{formatBudgetValue(value, normalizedFilter)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Max Price</p>
              <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                {max.map((value) => (
                  <button
                    key={`max-${value}`}
                    type="button"
                    onClick={() => setSelectedMaxBudget(value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedMaxBudget === value
                        ? "border-[#eb6239] bg-[#fff1eb] text-[#eb6239]"
                        : "border-border text-foreground hover:border-[#eb6239]"
                    }`}
                  >
                    ₹{formatBudgetValue(value, normalizedFilter)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isInvalid ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-[11px] font-medium text-red-600">Max budget should be greater than Min budget.</p>
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedMinBudget(null)
                setSelectedMaxBudget(null)
              }}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear All
            </button>
            <Button
              type="button"
              disabled={isInvalid}
              onClick={() => setShowBudgetDropdown(false)}
              className={`bg-[#eb6239] px-6 text-white hover:bg-[#d6522f] ${isInvalid ? 'cursor-not-allowed opacity-50 grayscale' : ''}`}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="search-bar-container relative w-full max-w-4xl"
      data-mobile-reveal="pending"
      data-mobile-reveal-delay="180"
      style={{ ["--pg-reveal-delay" as string]: "180ms" }}
      suppressHydrationWarning
    >
      <button
        type="button"
        aria-label="Close search filters"
        data-open={isSheetOpen}
        onClick={closeSheets}
        className="pg-mobile-backdrop md:hidden"
      />

      <div className="flex flex-col gap-2 rounded-[30px] border border-white/18 bg-white/92 p-2 shadow-[0_24px_60px_-36px_rgba(10,24,39,0.56)] backdrop-blur-md md:flex-row md:items-center md:rounded-full md:p-1.5">
        <div className="flex min-w-0 items-center gap-2 rounded-[22px] bg-[#f8fbfd]/92 px-3 py-2 md:flex-1 md:bg-transparent md:px-3">
          <LucknowLocationAutocomplete
            value={location}
            onChange={handleLocationInputChange}
            onSelect={handleResolvedLocation}
            dense
            showDetectButton
            className="flex-1"
            inputClassName="text-base md:text-sm"
          />
          <Button
            onClick={handleVoiceInput}
            variant="ghost"
            size="icon"
            className="h-11 w-11 flex-shrink-0 rounded-full border border-[#e2e8f0] bg-white/90 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary md:h-10 md:w-10 md:border-transparent md:bg-transparent"
            title="Voice input"
          >
            <Mic className={`h-4 w-4 transition-all duration-200 ${isListening ? "animate-pulse text-primary" : ""}`} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 md:flex md:min-w-0 md:items-center md:gap-2">
          <div className="relative md:min-w-[180px]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setShowPropertyDropdown((prev) => !prev)
                setShowBudgetDropdown(false)
              }}
              className="property-type-button flex h-11 w-full items-center justify-between rounded-[18px] bg-[#f8fbfd] px-4 text-sm font-semibold text-foreground transition md:rounded-full md:bg-transparent md:px-3"
            >
              <span className="truncate">{propertySummary}</span>
              <ChevronDown className={`ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${showPropertyDropdown ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="relative md:min-w-[180px]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setShowBudgetDropdown((prev) => !prev)
                setShowPropertyDropdown(false)
              }}
              className="budget-button flex h-11 w-full items-center justify-between rounded-[18px] bg-[#f8fbfd] px-4 text-sm font-semibold text-foreground transition md:rounded-full md:bg-transparent md:px-3"
            >
              <span className="truncate">{getBudgetDisplayText(selectedMinBudget, selectedMaxBudget, normalizedFilter)}</span>
              <ChevronDown className={`ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${showBudgetDropdown ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="group flex h-11 w-full items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(90deg,#eb6239_0%,#d6522f_100%)] px-5 text-sm font-semibold tracking-[0.08em] text-white transition-all md:w-auto md:min-w-[132px] md:rounded-full md:hover:scale-[1.02]"
        >
          <Search className="mr-2 h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0.5" />
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0.5">
            Search
          </span>
        </button>
      </div>

      {renderPropertyDropdown()}
      {renderBudgetDropdown()}
    </div>
  )
}
