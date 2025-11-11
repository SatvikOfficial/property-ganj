"use client"

import { useState, Suspense } from "react"
import { ChevronDown, X, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

function SearchFiltersContent() {
  const [filters, setFilters] = useState({
    location: "Eldeco Et...",
    type: "Buy",
    localities: [],
    budgetMin: 85,
    budgetMax: 435,
    propertyTypes: [],
    bhk: [],
    postedBy: "all",
  })

  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false)
  const [showBhkModal, setShowBhkModal] = useState(false)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [tempBudgetMin, setTempBudgetMin] = useState(filters.budgetMin)
  const [tempBudgetMax, setTempBudgetMax] = useState(filters.budgetMax)

  const propertyTypeOptions = ["Flat", "House", "Plot", "Villa", "Commercial"]
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"]
  const postedByOptions = ["All", "Owner", "Builder", "Agent"]

  const properties = [
    {
      id: 1,
      title: "3 bhk flat ready to move 1350 sq ft ready to move",
      location: "East Facing Property",
      price: "₹ 51.5 Lac",
      sqftPrice: "₹5,722 per sqft",
      carpetArea: "900 sqft",
      status: "Ready to Move",
      floor: "6 out of 11",
      images: 5,
      agent: "Township Experts",
      agentType: "PREFERRED AGENT",
      agentRating: 3,
      description: "3 bhk flat ready to move 1350 sq ft ready to move",
      postedDate: "Posted: Today",
      image: "/apartment-interior.jpg",
    },
    {
      id: 2,
      title: "2 BHK Flat for Sale in Excella Kutumb, Sultanpur Road Lucknow",
      location: "Excella Kutumb",
      price: "₹ 51.5 Lac",
      sqftPrice: "₹5,722 per sqft",
      carpetArea: "624 sqft",
      status: "Under Construction",
      floor: "9 out of 12",
      images: 3,
      agent: "Explore Realties",
      agentType: "Certified Agent",
      description: "In front of Kisan path highway outer ring road , strategic location project on sultanpur r...",
      postedDate: "Posted: Today",
      image: "/modern-apartment.jpg",
    },
    {
      id: 3,
      title: "1 BHK Flat for Sale in SV Infinity Heights, Vidhan Sabha Marg L...",
      location: "SV Infinity Heights",
      price: "₹ 95 Lac",
      sqftPrice: "₹11,502 per sqft",
      carpetArea: "454 sqft",
      status: "Under Construction",
      floor: "4 out of 6",
      images: 2,
      agent: "Resicom Forever Private Li...",
      agentType: "Certified Agent",
      description: "Whether youre looking to own your dream home or invest in a highgrowth corridor of...",
      postedDate: "Posted: Nov 08, 25",
      image: "/luxury-apartment.jpg",
    },
    {
      id: 4,
      title: "2 BHK Flat for Sale in Sahu City, Sultanpur Road Lucknow",
      location: "Sahu City",
      price: "₹ 60 Lac",
      sqftPrice: "₹5,106 per sqft",
      carpetArea: "686 sqft",
      status: "Ready to Move",
      floor: "6 out of 22",
      images: 22,
      agent: "Sahu City",
      agentType: "Certified Agent",
      description: "Near Sultanpur Road, Lucknow",
      postedDate: "Posted: Nov 08, 25",
      image: "/residential-property.jpg",
    },
  ]

  const removeBudgetFilter = () => {
    setFilters({ ...filters, budgetMin: 0, budgetMax: 10 })
  }

  const applyBudgetFilter = () => {
    setFilters({ ...filters, budgetMin: tempBudgetMin, budgetMax: tempBudgetMax })
    setShowBudgetModal(false)
  }

  const togglePropertyType = (type: string) => {
    setFilters({
      ...filters,
      propertyTypes: filters.propertyTypes.includes(type)
        ? filters.propertyTypes.filter((t) => t !== type)
        : [...filters.propertyTypes, type],
    })
  }

  const toggleBhk = (bhk: string) => {
    setFilters({
      ...filters,
      bhk: filters.bhk.includes(bhk) ? filters.bhk.filter((b) => b !== bhk) : [...filters.bhk, bhk],
    })
  }

  return (
    <>
      <div className="bg-card px-4 py-4 sticky top-[73px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Buy Dropdown */}
            <div className="relative">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary/90 flex items-center gap-1">
                {filters.type} <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Location */}
            <div className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm">
              {filters.location}
            </div>

            {/* Add More */}
            <button className="text-primary text-sm font-semibold hover:opacity-80">Add More</button>

            {/* Top Localities */}
            <button className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1">
              Top Localities <ChevronDown className="w-4 h-4" />
            </button>

            {/* Budget Filter */}
            <div className="relative">
              <button
                onClick={() => setShowBudgetModal(!showBudgetModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-2"
              >
                {filters.budgetMin} Lacs - {filters.budgetMax} Crore
                {filters.budgetMin > 0 || filters.budgetMax < 10 ? (
                  <X className="w-4 h-4 cursor-pointer" onClick={removeBudgetFilter} />
                ) : null}
              </button>

              {/* Budget Modal */}
              {showBudgetModal && (
                <div className="absolute top-12 left-0 bg-background rounded-lg shadow-xl p-6 w-80 z-50 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-4">Select at least one property type</p>
                  <div className="flex gap-4 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Min Budget</label>
                      <select
                        value={tempBudgetMin}
                        onChange={(e) => setTempBudgetMin(Number(e.target.value))}
                        className="border border-border rounded px-2 py-1 w-full text-sm bg-background"
                      >
                        {Array.from({ length: 100 }, (_, i) => i * 5).map((val) => (
                          <option key={val} value={val}>
                            ₹ {val} Lac
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Max Budget</label>
                      <select
                        value={tempBudgetMax}
                        onChange={(e) => setTempBudgetMax(Number(e.target.value))}
                        className="border border-border rounded px-2 py-1 w-full text-sm bg-background"
                      >
                        {Array.from({ length: 50 }, (_, i) => i * 1).map((val) => (
                          <option key={val} value={val}>
                            ₹ {val} Crore
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={tempBudgetMin}
                      onChange={(e) => setTempBudgetMin(Math.min(Number(e.target.value), tempBudgetMax))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={tempBudgetMax}
                      onChange={(e) => setTempBudgetMax(Math.max(Number(e.target.value), tempBudgetMin))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <button
                    onClick={applyBudgetFilter}
                    className="w-full bg-primary text-primary-foreground py-2 font-semibold hover:bg-primary/90 rounded"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Property Type */}
            <div className="relative">
              <button
                onClick={() => setShowPropertyTypeModal(!showPropertyTypeModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1"
              >
                Property Type <ChevronDown className="w-4 h-4" />
              </button>

              {/* Property Type Modal */}
              {showPropertyTypeModal && (
                <div className="absolute top-12 left-0 bg-background rounded-lg shadow-xl p-4 w-48 z-50 border border-border">
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

            {/* BHK */}
            <div className="relative">
              <button
                onClick={() => setShowBhkModal(!showBhkModal)}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1"
              >
                BHK <ChevronDown className="w-4 h-4" />
              </button>

              {/* BHK Modal */}
              {showBhkModal && (
                <div className="absolute top-12 left-0 bg-background rounded-lg shadow-xl p-4 w-40 z-50 border border-border">
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

            {/* Posted By */}
            <button className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-1">
              Posted By <ChevronDown className="w-4 h-4" />
            </button>

            {/* More Filters Badge */}
            <button className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-semibold text-sm hover:bg-muted/80 flex items-center gap-2">
              <span className="bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                1
              </span>
              More Filters <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <section className="bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Property Listings */}
          <div className="lg:col-span-2">
            <h2 className="text-muted-foreground font-semibold text-lg mb-6">Showing 30 Similar Properties</h2>

            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border"
                >
                  <div className="flex flex-col md:flex-row gap-4 p-4">
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-48 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 bg-foreground/80 text-background px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                        {property.images} Photos
                      </div>
                      <div className="absolute bottom-2 left-2 bg-foreground/80 text-background px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                        {property.postedDate}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button className="bg-background/80 rounded-full p-2 hover:bg-muted backdrop-blur-sm">
                          <Heart className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="bg-background/80 rounded-full p-2 hover:bg-muted backdrop-blur-sm">
                          <Share2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <Link href={`/property/${property.id}`}>
                          <h3 className="font-bold text-foreground hover:text-primary mb-1">{property.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </div>

                      {/* Key Info */}
                      <div className="grid grid-cols-3 gap-2 mb-3 bg-muted p-3 rounded-md">
                        <div className="text-xs">
                          <span className="text-muted-foreground block">CARPET AREA</span>
                          <span className="font-semibold text-foreground">{property.carpetArea}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground block">STATUS</span>
                          <span className="font-semibold text-foreground">{property.status}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground block">FLOOR</span>
                          <select className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold w-full">
                            <option>{property.floor}</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-3">{property.description}</p>

                      {/* Agent Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center font-bold text-secondary">
                          T
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{property.agentType}</p>
                          <p className="font-semibold text-foreground">{property.agent}</p>
                          {property.agentRating && (
                            <p className="text-xs text-accent-foreground">★ {property.agentRating} CRISIL Rating</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col items-end justify-between md:w-40 flex-shrink-0">
                      <div>
                        <p className="text-2xl font-bold text-foreground text-right">{property.price}</p>
                        <p className="text-sm text-muted-foreground text-right">{property.sqftPrice}</p>
                      </div>
                      <div className="space-y-2 w-full mt-4 md:mt-0">
                        <button className="w-full bg-primary text-primary-foreground py-2 font-semibold hover:bg-primary/90 rounded text-sm">
                          Contact Agent
                        </button>
                        <button className="w-full border-2 border-primary text-primary py-2 font-semibold hover:bg-primary/10 rounded text-sm">
                          Get Phone No.
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Promotional Banner */}
            <div className="bg-accent/40 rounded-lg p-6 mb-6 text-center border border-accent">
              <p className="text-accent-foreground font-bold mb-2">Share your story and WIN vouchers worth ₹5000</p>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:bg-primary/90">
                Click Here
              </button>
            </div>

            {/* Featured Project */}
            <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
              <img src="/featured-property.jpg" alt="Featured Project" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1">Sahu City Phase 2</h3>
                <p className="text-sm text-muted-foreground mb-3">Sahu Land Developers Pvt Ltd</p>
                <p className="text-xs text-muted-foreground mb-3">Sultanpur Road, Lucknow</p>
                <p className="text-sm text-foreground mb-2">
                  <span className="font-bold">2, 3 BHK Flats</span>
                </p>
                <p className="text-primary font-bold mb-4">₹57.9 Lac onwards</p>
                <p className="text-xs text-muted-foreground mb-4">Marketed by Sahu Land Devel...</p>
                <button className="w-full bg-secondary text-secondary-foreground py-2 font-semibold hover:bg-secondary/90 rounded">
                  View Details
                </button>
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
