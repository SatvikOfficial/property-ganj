"use client"

import { Bed, Bath, Ruler, MapPin, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function PropertyCard({ property }: any) {
  const [liked, setLiked] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-card border border-border">
      <div className="relative overflow-hidden bg-muted h-48">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={() => setLiked(!liked)}
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

      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-1 truncate">{property.title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">{property.price}</p>
        </div>

        {property.beds > 0 && (
          <div className="flex gap-4 mb-4 text-sm text-muted-foreground border-b border-border pb-4">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.beds} BHK</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.baths} Bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{property.sqft} sq.ft</span>
            </div>
          </div>
        )}

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">View Details</Button>
      </div>
    </Card>
  )
}
