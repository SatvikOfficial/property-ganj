"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import DynamicGreeting from "@/components/dynamic-greeting"
import PropertyCarousel from "@/components/property-carousel"

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("Buy")
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [agentCarouselIndex, setAgentCarouselIndex] = useState(0)
  const [localityCarouselIndex, setLocalityCarouselIndex] = useState(0)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const propertyTabs = ["Buy", "Rent", "New Projects", "PG", "Plot", "Commercial"]
  const allTabs = [...propertyTabs, "Post Free Property Ad"]

  useEffect(() => {
    const updateUnderline = () => {
      const activeTab = hoveredTab || selectedTab
      const tabElement = tabRefs.current[activeTab]
      if (tabElement) {
        const { offsetLeft, offsetWidth } = tabElement
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
      }
    }
    
    if (hoveredTab) {
      updateUnderline()
    } else {
      const timeout = setTimeout(updateUnderline, 150)
      return () => clearTimeout(timeout)
    }
  }, [selectedTab, hoveredTab])

  const quickCards = [
    {
      id: 1,
      title: "12K+ Properties listed for you",
      subtitle: "Continue last search",
      bgColor: "bg-accent/20",
    },
    {
      id: 2,
      title: "Share your story and WIN vouchers worth ₹5000",
      subtitle: "#PataBadloLifeBadlo",
      bgColor: "bg-accent/40",
    },
    {
      id: 3,
      title: "Top Handpicked Projects for you",
      subtitle: "See all",
      bgColor: "bg-accent/20",
    },
    {
      id: 4,
      title: "Top Exclusive Owner Properties",
      subtitle: "See all",
      bgColor: "bg-accent/20",
    },
  ]

  const featuredProjects = [
    {
      id: 1,
      name: "Kalyan Garden View",
      location: "Indira Nagar, Lucknow",
      type: "3 BHK Flats",
      price: "₹80.3 Lac onwards",
      builder: "by Krishna Colonisers",
      image: "/apartment-complex.jpg",
    },
    {
      id: 2,
      name: "Property Boss Green Park City",
      location: "Sultanpur Road, Lucknow",
      type: "Residential Plots",
      price: "₹7.6 Lac onwards",
      builder: "by Property Boss Real Infrastructure LLP",
      image: "/residential-plots.jpg",
      badge: "OFFER: 50Rs. discount per sqft on the current price.",
    },
  ]

  const trendingProperties = [
    {
      id: 1,
      bhk: "2 BHK Residential House",
      price: "₹42 Lac",
      sqft: "1200 sqft",
      location: "Jankipuram, Lucknow",
      status: "Ready to Move",
      imageCount: 2,
      image: "/2bhk-residential-house.jpg",
    },
    {
      id: 2,
      bhk: "3 BHK Multistorey Apartment",
      price: "₹98 Lac",
      sqft: "1775 sqft",
      location: "Gomtinagar Extension, Lucknow",
      status: "Ready to Move",
      imageCount: 7,
      image: "/3bhk-multistorey-apartment.jpg",
    },
    {
      id: 3,
      bhk: "2 BHK Residential House",
      price: "₹70 Lac",
      sqft: "1000 sqft",
      location: "Manas Vihar, Lucknow",
      status: "Ready to Move",
      imageCount: 20,
      image: "/2bhk-house-manas-vihar.jpg",
    },
    {
      id: 4,
      bhk: "4 BHK Multistorey Apartment",
      price: "₹90 Lac",
      sqft: "2287 sqft",
      location: "Gomti Nagar Extension Bypass Road",
      status: "Under Construction",
      imageCount: 1,
      image: "/4bhk-apartment.jpg",
    },
  ]

  const localities = [
    {
      id: 1,
      name: "Kanpur Road",
      priceRange: "₹2,509 - ₹12,500 per sqft",
      rating: 3.9,
      reviews: 127,
      properties: 193,
      image: "/kanpur-road-locality.jpg",
    },
    {
      id: 2,
      name: "Sushant Golf City",
      priceRange: "₹4,904 - ₹12,500 per sqft",
      rating: 4.4,
      reviews: 139,
      properties: 727,
      image: "/sushant-golf-city.jpg",
    },
    {
      id: 3,
      name: "Kishan Path",
      priceRange: "₹2,737 - ₹12,500 per sqft",
      rating: 4.1,
      reviews: 28,
      properties: 89,
      image: "/kishan-path.jpg",
    },
    {
      id: 4,
      name: "IIM Road",
      priceRange: "₹3,200 - ₹15,000 per sqft",
      rating: 4.3,
      reviews: 156,
      properties: 412,
      image: "/iim-road.jpg",
    },
  ]

  const agents = [
    {
      id: 1,
      name: "Vivid Infra",
      company: "Vivid Infra Land Pvt Ltd",
      since: 2012,
      buyers: "1000+",
      propertiesSale: 65,
      propertiesRent: 0,
      image: "/agent-profile-photo.jpg",
    },
    {
      id: 2,
      name: "Saurabh Gupta",
      company: "Safe Invest Realty",
      since: 2012,
      buyers: "100+",
      propertiesSale: 56,
      propertiesRent: 0,
      image: "/agent-profile.png",
    },
    {
      id: 3,
      name: "Rahul Juyal",
      company: "Pratham Realty Solutions",
      since: 2011,
      buyers: "4000+",
      propertiesSale: 71,
      propertiesRent: 0,
      image: "/agent-photo.jpg",
    },
    {
      id: 4,
      name: "Shiyaram Singh",
      company: "S.R. Broker LLP",
      since: 2017,
      buyers: "4000+",
      propertiesSale: 144,
      propertiesRent: 10,
      image: "/agent-profile-photo.jpg",
    },
  ]

  const exclusiveProperties = [
    {
      id: 1,
      bhk: "2 BHK Flat",
      price: "₹42 Lac",
      sqft: "1200 sqft",
      imageCount: 2,
      image: "/2bhk-flat.jpg",
    },
    {
      id: 2,
      bhk: "3 BHK Flat",
      price: "₹98 Lac",
      sqft: "1775 sqft",
      imageCount: 7,
      image: "/3bhk-flat.jpg",
    },
    {
      id: 3,
      bhk: "2 BHK Flat",
      price: "₹70 Lac",
      sqft: "1000 sqft",
      imageCount: 20,
      image: "/2bhk-flat.jpg",
    },
    {
      id: 4,
      bhk: "4 BHK Flat",
      price: "₹90 Lac",
      sqft: "2287 sqft",
      imageCount: 1,
      image: "/4bhk-flat.jpg",
    },
  ]

  const industryInsights = [
    {
      id: 1,
      title: "Occupancy Certificate (OC) - Meaning, Documents Required, and Importance",
      icon: "circle",
    },
    {
      id: 2,
      title: "15+ Vastu Tips for Residential Building",
      icon: "document",
    },
    {
      id: 3,
      title: "Ready Reckoner Rate - What Does it Mean and How to Calculate It?",
      icon: "document",
    },
    {
      id: 4,
      title: "Lucknow Kanpur Expressway - Route, Map and Other Details",
      icon: "document",
    },
    {
      id: 5,
      title: "Lucknow Development Authority: All You Need to Know",
      icon: "document",
    },
  ]

  const legalUpdates = [
    {
      id: 1,
      title: "Format of Will and How to Write a Will?",
      type: "Watch video",
      image: "/legal-document-stack.png",
    },
    {
      id: 2,
      title: "What is a Conveyance Deed and Why Is It Important?",
      type: "Read article",
      image: "/conveyance-deed.jpg",
    },
  ]

  const popularProperties = [
    {
      id: 1,
      bhk: "2 BHK Flat",
      price: "₹42 Lac",
      sqft: "1200 sqft",
      imageCount: 2,
      image: "/2bhk-flat.jpg",
    },
    {
      id: 2,
      bhk: "3 BHK Flat",
      price: "₹98 Lac",
      sqft: "1775 sqft",
      imageCount: 7,
      image: "/3bhk-flat.jpg",
    },
    {
      id: 3,
      bhk: "2 BHK Flat",
      price: "₹70 Lac",
      sqft: "1000 sqft",
      imageCount: 20,
      image: "/2bhk-flat.jpg",
    },
    {
      id: 4,
      bhk: "4 BHK Flat",
      price: "₹90 Lac",
      sqft: "2287 sqft",
      imageCount: 1,
      image: "/4bhk-flat.jpg",
    },
  ]

  const nextAgentCarousel = () => {
    setAgentCarouselIndex((prev) => (prev + 1) % agents.length)
  }

  const nextLocalityCarousel = () => {
    setLocalityCarouselIndex((prev) => (prev + 1) % (localities.length - 2))
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero & Search Section */}
      <section className="bg-background pt-8 pb-6 px-4 relative z-0">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="hero_brightener.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="max-w-7xl mx-auto pl-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Content */}
            <div className="flex-1 pl-8">
              <DynamicGreeting />

              {/* Property Type Tabs */}
              <div className="relative flex gap-2 md:gap-6 mb-6 mt-4 overflow-x-auto pb-1">
                {propertyTabs.map((tab) => (
                  <button
                    key={tab}
                    ref={(el) => { tabRefs.current[tab] = el }}
                    onClick={() => setSelectedTab(tab)}
                    onMouseEnter={() => setHoveredTab(tab)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`relative whitespace-nowrap text-sm md:text-base font-semibold pb-1.5 transition-all duration-300 ${
                      selectedTab === tab ? "text-primary" : "text-muted-foreground hover:text-primary hover:scale-105"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <button 
                  ref={(el) => { tabRefs.current["Post Free Property Ad"] = el }}
                  onMouseEnter={() => setHoveredTab("Post Free Property Ad")}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="relative whitespace-nowrap text-sm md:text-base font-semibold pb-1.5 text-muted-foreground hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Post Free Property Ad
                </button>
                
                {/* Animated Underline */}
                <span
                  className="absolute bottom-0 h-1 bg-primary rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    left: `${underlineStyle.left}px`,
                    width: `${underlineStyle.width}px`,
                  }}
                />
              </div>

              {/* Search Bar */}
              <div className="w-full max-w-2xl pl-5">
                <SearchBar />
              </div>
            </div>

            {/* Right side: Carousel */}
            <div className="md:order-last pr-8">
              <PropertyCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Cards Section */}
      <section className="bg-accent/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-foreground font-bold text-lg mb-6">Because you searched Lucknow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickCards.map((card) => (
              <div
                key={card.id}
                className={`${card.bgColor} rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow`}
              >
                <p className="text-primary font-bold text-lg mb-2">{card.title}</p>
                <p className="text-primary text-sm hover:underline">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <section className="bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Featured Projects</h2>
            <a href="#" className="text-primary font-semibold hover:underline">
              See all Projects →
            </a>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`transition-opacity duration-500 ${
                    index === currentCarouselIndex ? "opacity-100" : "opacity-0 hidden lg:block"
                  }`}
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      {project.badge && (
                        <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 font-semibold text-sm">
                          {project.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground text-lg mb-2">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{project.location}</p>
                      <p className="text-sm text-muted-foreground mb-3">{project.type}</p>
                      <p className="font-semibold text-foreground mb-1">{project.price}</p>
                      <p className="text-sm text-muted-foreground mb-4">Marketed by {project.builder}</p>
                      <Link href={`/property/${project.id}`}>
                        <button className="w-full bg-primary text-primary-foreground py-2 font-semibold hover:bg-primary/90 transition-colors rounded">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-background rounded-full p-2 shadow-lg hover:shadow-xl z-10">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-background rounded-full p-2 shadow-lg hover:shadow-xl z-10">
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Trending in Lucknow section */}
      <section className="bg-accent/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Trending in Lucknow</h2>
            <a href="#" className="text-primary font-semibold hover:underline">
              See all Properties →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="cursor-pointer group">
                  <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.bhk}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                      {property.imageCount}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-semibold mb-1">{property.bhk}</p>
                  <p className="text-foreground font-bold">
                    {property.price} <span className="text-muted-foreground font-normal text-sm">| {property.sqft}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-sm text-muted-foreground">{property.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Localities section */}
      <section className="bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Popular Localities in Lucknow</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Cyclone card */}
              <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg p-8 flex flex-col justify-center items-center text-center">
                <h3 className="text-2xl font-bold text-secondary mb-2">Cyclone</h3>
                <p className="text-muted-foreground font-semibold">
                  Popular Localities
                  <br />
                  in Lucknow
                </p>
              </div>

              {/* Locality cards */}
              {localities.slice(0, 3).map((locality) => (
                <div
                  key={locality.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                    {locality.name}
                    <span className="text-muted-foreground text-sm">↗</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{locality.priceRange}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-accent">★</span>
                    <span className="font-semibold">{locality.rating}</span>
                    <span className="text-muted-foreground text-sm">{locality.reviews} Reviews</span>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-3 text-center">
                    <p className="text-primary font-bold">{locality.properties} Properties for Sale →</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-lg hover:shadow-xl z-10">
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* MB Preferred Agents section */}
      <section className="bg-accent/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">MB Preferred Agents in Lucknow</h2>
            <a href="#" className="text-primary font-semibold hover:underline">
              See all →
            </a>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.slice(agentCarouselIndex, agentCarouselIndex + 4).map((agent) => (
                <div key={agent.id} className="bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs text-secondary font-bold mb-1">MB Preferred</p>
                      <h3 className="font-bold text-foreground">{agent.name}</h3>
                    </div>
                    <span className="text-xs bg-foreground text-background px-2 py-1 rounded">✓</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-3">{agent.company}</p>
                  <div className="flex gap-4 text-xs mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-muted-foreground">Operating Since</p>
                      <p className="font-bold text-foreground">{agent.since}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Buyers Served</p>
                      <p className="font-bold text-foreground">{agent.buyers}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center text-sm">
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-lg">{agent.propertiesSale}</p>
                      <p className="text-xs text-muted-foreground">Properties for Sale</p>
                    </div>
                    {agent.propertiesRent > 0 && (
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-lg">{agent.propertiesRent}</p>
                        <p className="text-xs text-muted-foreground">Properties for Rent</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={nextAgentCarousel}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-lg hover:shadow-xl z-10"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Exclusive Owner Properties section */}
      <section className="bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Exclusive Owner Properties in Lucknow</h2>
            <a href="#" className="text-primary font-semibold hover:underline">
              See all Properties →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exclusiveProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <div className="cursor-pointer group">
                  <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.bhk}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                      {property.imageCount}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-semibold mb-1">{property.bhk}</p>
                  <p className="text-foreground font-bold">
                    {property.price} <span className="text-muted-foreground font-normal text-sm">| {property.sqft}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Your Real Estate Guide section */}
      <section className="bg-accent/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Your Real Estate Guide</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Industry Insights */}
            <div className="border-2 border-primary rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Industry Insights</h3>
              <ul className="space-y-3">
                {industryInsights.map((insight) => (
                  <li
                    key={insight.id}
                    className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors"
                  >
                    <span className="text-primary text-xl">●</span>
                    <span className="text-muted-foreground text-sm">{insight.title}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="text-primary font-semibold text-sm mt-6 inline-block hover:underline">
                See all →
              </a>
            </div>

            {/* Legal Updates */}
            <div className="border-2 border-primary rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Legal Updates</h3>
              <div className="space-y-4">
                {legalUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <img
                      src={update.image || "/placeholder.svg"}
                      alt={update.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-2">{update.title}</p>
                      <a href="#" className="text-primary text-sm font-semibold hover:underline">
                        {update.type} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="text-primary font-semibold text-sm mt-4 inline-block hover:underline">
                See all →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Owner Properties */}
      <section className="bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Popular Owner Properties</h2>
            <a href="#" className="text-primary font-semibold hover:underline">
              See all Properties →
            </a>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularProperties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`}>
                  <div className="cursor-pointer group">
                    <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.bhk}
                        className="w-full h-full object-cover group-hover:.scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                        {property.imageCount}
                      </div>
                    </div>
                    <p className="text-muted-foreground font-semibold mb-1">{property.bhk}</p>
                    <p className="text-foreground font-bold">
                      {property.price} <span className="text-muted-foreground font-normal text-sm">| {property.sqft}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-background rounded-full p-2 shadow-lg hover:shadow-xl">
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
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
