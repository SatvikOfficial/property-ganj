"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchFilters({ filters, setFilters }: any) {
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="City or locality"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
          <select
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
          <select
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <option value="all">All Prices</option>
            <option value="under50">Under 50 Lakhs</option>
            <option value="50to1cr">50L - 1 Cr</option>
            <option value="1to2cr">1 - 2 Cr</option>
            <option value="above2cr">Above 2 Cr</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button className="w-full bg-primary hover:bg-primary/90 h-10 text-primary-foreground">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
