"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Bed, Bath, Ruler, MapPin, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PropertyCardProps = {
  property: {
    id?: string | number
    _id?: string
    title?: string
    bhk?: string
    beds?: number
    baths?: number
    sqft?: string | number
    location?: string
    price?: string
    image?: string
    featured?: boolean
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [liked, setLiked] = useState(false)
  const propertyId = useMemo(() => property.id ?? property._id ?? "", [property])
  const imageSrc = property.image || "/placeholder.svg"
  const title = property.title || property.bhk || "Property Listing"
  const displayBeds =
    property.bhk ||
    (property.beds ? `${property.beds} BHK` : undefined)
  const displayBaths = property.baths ? `${property.baths} Bath` : undefined
  const displaySqft = property.sqft ? `${property.sqft} sq.ft` : undefined

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-card border border-border">
      <Link href={propertyId ? `/property/${propertyId}` : "#"} className="block">
        <div className="relative overflow-hidden bg-muted h-48">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              setLiked((prev) => !prev)
            }}
            className="absolute top-3 right-3 bg-background/80 rounded-full p-2 shadow-md hover:shadow-lg transition-all backdrop-blur-sm"
          >
            <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
          {property.featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={propertyId ? `/property/${propertyId}` : "#"}>
          <h3 className="font-bold text-lg text-foreground mb-1 truncate">{title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{property.location || "Lucknow"}</span>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">{property.price || "Price on request"}</p>
        </div>

        {(displayBeds || displayBaths || displaySqft) && (
          <div className="flex gap-4 mb-4 text-sm text-muted-foreground border-b border-border pb-4">
            {displayBeds && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{displayBeds}</span>
              </div>
            )}
            {displayBaths && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{displayBaths}</span>
              </div>
            )}
            {displaySqft && (
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" />
                <span>{displaySqft}</span>
              </div>
            )}
          </div>
        )}

        <Link href={propertyId ? `/property/${propertyId}` : "#"}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  )
}
