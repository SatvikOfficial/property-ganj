"use client"

import { useMemo, useState, useEffect } from "react"
import { MapPin, ChevronDown, Search, Mic, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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

export default function SearchBar({ defaultLocation = "Lucknow", activeFilter = "Buy" }: SearchBarProps) {
  const router = useRouter()
  const normalizedFilter = normalizeFilter(activeFilter)

  const [location, setLocation] = useState(defaultLocation)
  const [isListening, setIsListening] = useState(false)
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [selectedBedroom, setSelectedBedroom] = useState<number | null>(null)
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false)
  const [selectedMinBudget, setSelectedMinBudget] = useState<number | null>(null)
  const [selectedMaxBudget, setSelectedMaxBudget] = useState<number | null>(null)

  useEffect(() => {
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      if (showPropertyDropdown || showBudgetDropdown) {
        heroSection.style.zIndex = '10000';
      } else {
        heroSection.style.zIndex = '0';
      }
    }
  }, [showPropertyDropdown, showBudgetDropdown]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Don't close if clicking inside the dropdown
      if (target.closest('.property-dropdown') || target.closest('.budget-dropdown')) {
        return
      }
      // Don't close if clicking the button that opens the dropdown
      if (target.closest('.property-type-button') || target.closest('.budget-button')) {
        return
      }
      if (!target.closest('.search-bar-container')) {
        setShowPropertyDropdown(false)
        setShowBudgetDropdown(false)
      }
    }

    if (showPropertyDropdown || showBudgetDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPropertyDropdown, showBudgetDropdown])

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
    params.set("q", location)

    const purpose = normalizedFilter === "rental" || normalizedFilter === "pg" ? "rent" : "sale"
    params.set("purpose", purpose)

    if (selectedPropertyTypes.length) {
      params.set("propertyType", selectedPropertyTypes.join(","))
    }

    if (selectedBedroom) {
      // Handle 5+ BHK (6) - send 5 for API
      const bedroomsValue = selectedBedroom === 6 ? 5 : selectedBedroom
      params.set("bedrooms", String(bedroomsValue))
    }

    if (selectedMinBudget) {
      params.set("minPrice", String(convertBudgetToRupees(selectedMinBudget, normalizedFilter)))
    }

    if (selectedMaxBudget) {
      params.set("maxPrice", String(convertBudgetToRupees(selectedMaxBudget, normalizedFilter)))
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    setLocation("Detecting location...")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          const city = data.address?.city || data.address?.town || data.address?.village || "Unknown Location"
          setLocation(city)
        } catch (error) {
          console.error("Error reverse geocoding:", error)
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`)
        }
      },
      (error) => {
        console.error("Error detecting location:", error)
        setLocation(defaultLocation)
        alert("Unable to detect location. Please enable location services.")
      }
    )
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
    }
    recognition.start()
  }

  const renderPropertyDropdown = () => (
    <div className="absolute top-full md:top-12 left-0 w-full md:w-[320px] rounded-2xl border border-border bg-white shadow-xl p-4 z-[9999] mt-2 md:mt-0 max-h-[80vh] overflow-y-auto">
      {propertyTypeGroups.map((group) => (
        <div key={group.title} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{group.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => togglePropertyType(item.value)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  selectedPropertyTypes.includes(item.value)
                    ? "border-[#eb6239] bg-[#fff1eb] text-[#eb6239]"
                    : "border-border text-foreground hover:border-[#eb6239]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="border-t border-border pt-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedBedroom((prev) => (prev === option ? null : option))}
              className={`rounded-full border px-3 py-1 text-sm ${
                selectedBedroom === option
                  ? "border-[#264143] bg-[#264143] text-white"
                  : "border-border text-foreground hover:border-[#264143]"
              }`}
            >
              {option === 6 ? "5+ BHK" : `${option} BHK`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBudgetDropdown = () => {
    const { min, max } = getBudgetRanges(normalizedFilter)
    return (
      <div className="absolute top-full md:top-12 left-0 w-full md:w-[360px] rounded-2xl border border-border bg-white shadow-xl p-4 z-[9999] mt-2 md:mt-0 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Min Price</p>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {min.map((value) => (
                <button
                  key={`min-${value}`}
                  type="button"
                  onClick={() => setSelectedMinBudget(value)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
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
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Max Price</p>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {max.map((value) => (
                <button
                  key={`max-${value}`}
                  type="button"
                  onClick={() => setSelectedMaxBudget(value)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                    selectedMaxBudget === value
                      ? "border-[#264143] bg-[#264143] text-white"
                      : "border-border text-foreground hover:border-[#264143]"
                  }`}
                >
                  ₹{formatBudgetValue(value, normalizedFilter)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => {
              setSelectedMinBudget(null)
              setSelectedMaxBudget(null)
            }}
            className="text-sm font-semibold text-muted-foreground"
          >
            Clear
          </button>
          <Button
            type="button"
            onClick={() => setShowBudgetDropdown(false)}
            className="bg-[#eb6239] hover:bg-[#d6522f]"
          >
            Apply
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl w-full search-bar-container">
      <div className="flex flex-col md:flex-row gap-1 md:gap-2 items-stretch md:items-center bg-background rounded-md md:rounded-full border-2 border-black shadow-sm md:hover:shadow-md transition-shadow p-0.5 md:p-1.5 active:shadow-md md:active:shadow-md">
        <div className="flex items-center gap-0.5 md:gap-2 px-1 md:px-3 flex-1 min-w-0 overflow-hidden">
          <MapPin className="w-2.5 h-2.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="Lucknow"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 outline-none text-foreground bg-transparent text-xs md:text-sm min-w-0 overflow-hidden text-ellipsis"
            style={{ maxWidth: 'calc(100% - 60px)' }}
          />
          <Button
            onClick={handleAutoDetect}
            variant="ghost"
            size="sm"
            className="h-4 w-4 md:h-7 md:w-auto md:px-2 p-0 hover:bg-secondary/20 rounded-md transition-all group flex-shrink-0"
            title="Auto-detect location"
          >
            <Locate className="w-2 h-2 md:w-3.5 md:h-3.5 text-muted-foreground group-hover:text-secondary transition-all duration-200" />
          </Button>
          <Button
            onClick={handleVoiceInput}
            variant="ghost"
            size="sm"
            className="h-4 w-4 md:h-7 md:w-auto md:px-2 p-0 hover:bg-primary/10 rounded-md transition-all group flex-shrink-0"
            title="Voice input"
          >
            <Mic className={`w-2 h-2 md:w-3.5 md:h-3.5 transition-all duration-200 ${isListening ? "text-primary animate-pulse" : "text-muted-foreground group-hover:text-primary"}`} />
          </Button>
        </div>

        <div className="relative flex items-center gap-0.5 md:gap-2 px-1 md:px-3 border-t md:border-t-0 md:border-l border-border min-w-[90px] md:min-w-[160px] overflow-visible">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowPropertyDropdown((prev) => !prev)
              setShowBudgetDropdown(false)
            }}
            className="property-type-button flex w-full items-center justify-between text-xs md:text-sm font-semibold text-foreground active:opacity-70 touch-manipulation truncate py-0.5 md:py-1"
          >
            <span className="truncate min-w-0">{propertySummary}</span>
            <ChevronDown className="w-2 h-2 md:w-3.5 md:h-3.5 text-muted-foreground flex-shrink-0 ml-0.5" />
          </button>
          {showPropertyDropdown && (
            <div className="property-dropdown" onClick={(e) => e.stopPropagation()}>
              {renderPropertyDropdown()}
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-0.5 md:gap-2 px-1 md:px-3 border-t md:border-t-0 md:border-l border-border min-w-[70px] md:min-w-[150px] overflow-visible">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowBudgetDropdown((prev) => !prev)
              setShowPropertyDropdown(false)
            }}
            className="budget-button flex w-full items-center justify-between text-xs md:text-sm font-semibold text-foreground active:opacity-70 touch-manipulation truncate py-0.5 md:py-1"
          >
            <span className="truncate min-w-0">{getBudgetDisplayText(selectedMinBudget, selectedMaxBudget, normalizedFilter)}</span>
            <ChevronDown className="w-2 h-2 md:w-3.5 md:h-3.5 text-muted-foreground flex-shrink-0 ml-0.5" />
          </button>
          {showBudgetDropdown && (
            <div className="budget-dropdown" onClick={(e) => e.stopPropagation()}>
              {renderBudgetDropdown()}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center text-white border-none rounded-full transition-all md:hover:scale-105 active:scale-95 group touch-manipulation w-full md:w-auto justify-center flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(to right, #eb6239, #d6522f)",
            padding: "0.4em 0.6em 0.4em 0.5em",
            fontSize: "11px",
            fontWeight: "500",
            letterSpacing: "0.05em",
          }}
        >
          <Search className="mr-0 h-2.5 w-2.5 md:h-4 md:w-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-1 group-hover:rotate-12" />
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-1.5 hidden sm:inline">
            Search
          </span>
        </button>
      </div>
    </div>
  )
}
