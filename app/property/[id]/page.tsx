"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Heart, Share2, MapPin } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock property data - in a real app this would come from a database
  const property = {
    id: params.id,
    name: "Kalyan Garden View",
    location: "Indira Nagar, Lucknow",
    price: "₹80.3 Lac onwards",
    rating: 4.5,
    reviews: 1250,
    bhk: "3 BHK Flats",
    area: "1200-1500 sqft",
    type: "Residential",
    builder: "Krishna Colonisers",
    images: [
      "/apartment-complex.jpg",
      "/3bhk-luxury-living.jpg",
      "/3bhk-apartment-interior.jpg",
      "/modern-2bhk-apartment.jpg",
    ],
    amenities: [
      { icon: "🏊", name: "Swimming Pool" },
      { icon: "🎾", name: "Tennis Court" },
      { icon: "🏋️", name: "Gym" },
      { icon: "🌳", name: "Garden" },
      { icon: "🅿️", name: "Parking" },
      { icon: "⚡", name: "Power Backup" },
      { icon: "📶", name: "Wifi" },
      { icon: "🔒", name: "Security" },
    ],
    description:
      "Kalyan Garden View is a premium residential project offering spacious 3 BHK flats with modern amenities.",
    highlights: ["RERA Approved", "Earthquake Resistant", "Vastu Compliant", "Green Building Certificate"],
    specifications: [
      { key: "Project Status", value: "Under Construction" },
      { key: "Possession", value: "May 2025" },
      { key: "Parking", value: "2 per unit" },
      { key: "Power Backup", value: "24/7" },
    ],
    similarProperties: [
      {
        id: 1,
        bhk: "2 BHK Flat",
        price: "₹85 Lac",
        sqft: "1260 sqft",
        imageCount: 13,
        image: "/2bhk-apartment.jpg",
      },
      {
        id: 2,
        bhk: "3 BHK Flat",
        price: "₹78 Lac",
        sqft: "1230 sqft",
        imageCount: 17,
        image: "/3bhk-apartment.jpg",
      },
      {
        id: 3,
        bhk: "3 BHK Flat",
        price: "₹1.20 Cr",
        sqft: "1755 sqft",
        imageCount: 18,
        image: "/luxury-apartment.jpg",
      },
      {
        id: 4,
        bhk: "3 BHK Flat",
        price: "₹2.20 Cr",
        sqft: "1960 sqft",
        imageCount: 15,
        image: "/premium-apartment.jpg",
      },
    ],
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Image Gallery */}
      <section className="relative h-96 bg-muted overflow-hidden">
        <img
          src={property.images[currentImageIndex] || "/placeholder.svg"}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 rounded-full p-2 shadow-lg hover:shadow-xl backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 rounded-full p-2 shadow-lg hover:shadow-xl backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-primary w-6" : "bg-muted-foreground/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Property Details */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header Info */}
            <div className="mb-6 pb-6 border-b border-border">
              <h1 className="text-3xl font-bold text-foreground mb-2">{property.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-accent-foreground">★</span>
                  <span>{property.rating}</span>
                  <span className="text-muted-foreground">({property.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-foreground">{property.price}</span>
                <span className="text-muted-foreground">{property.bhk}</span>
                <span className="text-muted-foreground">{property.area}</span>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">Request Deal</Button>
                <Button variant="outline" onClick={() => setIsWishlisted(!isWishlisted)} className="border-border">
                  <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="outline" className="border-border">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-3">About {property.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl mb-2">{amenity.icon}</div>
                    <p className="text-foreground font-medium text-sm">{amenity.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Highlights</h2>
              <ul className="grid grid-cols-2 gap-3">
                {property.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Specifications</h2>
              <div className="space-y-3">
                {property.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-border last:border-b-0">
                    <span className="text-muted-foreground">{spec.key}</span>
                    <span className="font-semibold text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card border border-border p-6 rounded-lg sticky top-24">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Contact Builder</h3>
                <p className="text-muted-foreground text-sm mb-4">by {property.builder}</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Contact Builder</Button>
              </div>
              <Button variant="outline" className="w-full border-border">
                Call Builder
              </Button>
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-bold text-foreground mb-3">Location Map</h3>
                <div className="bg-muted h-32 rounded-lg flex items-center justify-center text-muted-foreground">
                  Map would go here
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="bg-accent/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {property.similarProperties.map((prop) => (
              <div key={prop.id} className="cursor-pointer group">
                <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                  <img
                    src={prop.image || "/placeholder.svg"}
                    alt={prop.bhk}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 bg-foreground/80 text-background px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                    {prop.imageCount}
                  </div>
                </div>
                <p className="text-foreground font-semibold mb-1">{prop.bhk}</p>
                <p className="text-foreground font-bold">
                  {prop.price} <span className="text-muted-foreground font-normal text-sm">| {prop.sqft}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2025 MagicBricks. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
