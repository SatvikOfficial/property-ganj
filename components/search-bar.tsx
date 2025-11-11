"use client"

import { useState } from "react"
import { MapPin, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [location, setLocation] = useState("Lucknow")
  const [propertyType, setPropertyType] = useState("Flat +2")
  const [budget, setBudget] = useState("Budget")
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams({
      location,
      type: propertyType,
      budget,
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-background rounded-full border-2 border-border p-2 md:pr-1">
      {/* Location Input */}
      <div className="flex items-center gap-2 px-3 flex-1">
        <MapPin className="w-5 h-5 text-primary" />
        <input
          type="text"
          placeholder="Lucknow"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 outline-none text-foreground bg-transparent"
        />
      </div>

      {/* Property Type Dropdown */}
      <div className="flex items-center gap-2 px-3 border-l border-border">
        <input
          type="text"
          placeholder="Flat +2"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="outline-none text-foreground bg-transparent w-24"
        />
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Budget Dropdown */}
      <div className="flex items-center gap-2 px-3 border-l border-border">
        <input
          type="text"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="outline-none text-foreground bg-transparent w-20"
        />
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Search Button */}
      <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  )
}
