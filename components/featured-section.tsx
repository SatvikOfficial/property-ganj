"use client"

import { Star } from "lucide-react"
import PropertyCard from "./property-card"

export default function FeaturedSection({ properties }: any) {
  return (
    <section className="py-16 px-4 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-6 h-6 text-primary fill-primary" />
          <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
