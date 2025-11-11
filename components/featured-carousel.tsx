"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const projects = [
    {
      id: 1,
      name: "Kalyan Garden View",
      location: "Indira Nagar, Lucknow",
      type: "3 BHK Flats",
      price: "₹80.3 Lac onwards",
      builder: "by Krishna Colonisers",
      image: "/apartment-complex-lucknow.jpg",
      logo: "🏗️",
    },
    {
      id: 2,
      name: "Property Boss Green Park City",
      location: "Sultanpur Road, Lucknow",
      type: "Residential Plots",
      price: "₹7.6 Lac onwards",
      builder: "by Property Boss Real Infrastructure LLP",
      image: "/residential-plots-green.jpg",
      badge: "OFFER",
      badgeText: "50Rs. discount per sqft on the current price.",
      logo: "🌳",
    },
  ]

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0 hidden lg:block"}`}
          >
            <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                {project.badge && (
                  <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 font-semibold">
                    {project.badgeText}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{project.logo}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                  <p className="text-right text-sm text-muted-foreground">{project.type}</p>
                </div>
                <p className="font-semibold text-foreground mb-1">{project.price}</p>
                <p className="text-sm text-muted-foreground">Marketed by {project.builder}</p>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-2 font-semibold hover:bg-primary/90 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-background/80 rounded-full p-2 shadow-lg hover:shadow-xl z-10 backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-background/80 rounded-full p-2 shadow-lg hover:shadow-xl z-10 backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>
    </div>
  )
}
