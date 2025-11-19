"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import DynamicGreeting from "@/components/dynamic-greeting"
import PropertyCarousel from "@/components/property-carousel"
import FeaturedStackCard from "@/components/FeaturedStackCard"
import LikeButton from "@/components/LikeButton"

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("Buy")
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [agentCarouselIndex, setAgentCarouselIndex] = useState(0)
  const [localityCarouselIndex, setLocalityCarouselIndex] = useState(0)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [liveProperties, setLiveProperties] = useState<any[]>([])
  const [likedProperties, setLikedProperties] = useState<string[]>([])
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

  // Generate placeholder properties for home page with real images
  const propertyImages = [
    "/2bhk-apartment.jpg",
    "/3bhk-apartment.jpg",
    "/4bhk-apartment.jpg",
    "/modern-apartment.jpg",
    "/luxury-apartment.jpg",
    "/apartment-complex.jpg",
    "/residential-property.jpg",
    "/2bhk-flat.jpg",
    "/3bhk-flat.jpg",
    "/4bhk-flat.jpg",
    "/premium-apartment.jpg",
    "/modern-2bhk-apartment.jpg",
  ]

  const generatePlaceholderProperties = (count: number) => {
    const locations = ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Aminabad", "Chowk", "Mahanagar"]
    const propertyTypes = ["Apartment", "Independent House/Villa", "Plot/Land"]
    const bhkOptions = [1, 2, 3, 4]
    
    return Array.from({ length: count }, (_, i) => ({
      _id: `placeholder-${i}`,
      specs: {
        bedrooms: bhkOptions[i % bhkOptions.length],
        carpetArea: 1000 + (i * 100),
        areaUnit: "sqft"
      },
      propertyType: propertyTypes[i % propertyTypes.length],
      price: (5000000 + i * 500000) * (i % 2 === 0 ? 1 : 0.3),
      purpose: i % 2 === 0 ? 'sale' : 'rent',
      location: {
        locality: locations[i % locations.length],
        city: "Lucknow"
      },
      media: {
        photos: [{ url: propertyImages[i % propertyImages.length] }]
      },
      isPlaceholder: true
    }))
  }

  useEffect(() => {
    setLiveProperties(generatePlaceholderProperties(12))
    setLikedProperties([])
  }, [])

  const formatPrice = (value?: number) => {
    if (!value) return '₹ —'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const derivedProperties = liveProperties.map((property) => ({
    id: property._id?.toString?.() ?? property.id ?? '',
    bhk: property.specs?.bedrooms
      ? `${property.specs.bedrooms} BHK ${property.propertyType}`
      : property.propertyType,
    price: formatPrice(property.price),
    sqft: property.specs?.carpetArea || property.specs?.builtUpArea || '—',
    location: [property.location?.locality, property.location?.city]
      .filter(Boolean)
      .join(', '),
    status: property.purpose === 'rent' ? 'Available for Rent' : 'Available',
    imageCount: property.media?.photos?.length || 0,
    image: property.media?.photos?.[0]?.url || '/placeholder.svg',
    isLiked: likedProperties.includes(property._id?.toString?.() ?? property.id ?? ''),
  }))

  const trendingFeed = derivedProperties.slice(0, 4)
  const exclusiveFeed = derivedProperties.slice(4, 8)
  const popularFeed = derivedProperties.slice(8, 12)

  const renderEmptyState = (label: string) => (
    <div className="col-span-full bg-card border border-dashed border-border rounded-xl p-8 text-center">
      <p className="text-foreground font-semibold mb-2">No {label} yet</p>
      <p className="text-sm text-muted-foreground mb-4">
        Be the first to showcase your property here.
      </p>
      <Link
        href="/list-property"
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
      >
        List your property
      </Link>
    </div>
  )

  const quickCards = [
    {
      id: 1,
      title: "Over 10,000+ Properties waiting for you",
      subtitle: "Continue your last search",
      bgColor: "bg-accent/20",
    },
    {
      id: 2,
      title: "Share your Property Ganj story and WIN vouchers worth ₹5000",
      subtitle: "#MeriPropertyMeraGanj",
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
    },
    {
      id: 3,
      name: "Sahu City Phase 2",
      location: "Sultanpur Road, Lucknow",
      type: "2, 3 BHK Flats",
      price: "₹57.9 Lac onwards",
      builder: "by Sahu Land Developers Pvt Ltd",
      image: "/featured-property.jpg",
    },
    {
      id: 4,
      name: "Excella Kutumb",
      location: "Sultanpur Road, Lucknow",
      type: "2 BHK Flats",
      price: "₹51.5 Lac onwards",
      builder: "by Township Experts",
      image: "/modern-apartment.jpg",
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

  const industryInsights = [
    {
      id: 1,
      title: "Understanding Circle Rates in Lucknow",
      icon: "circle",
    },
    {
      id: 2,
      title: "Vastu Shastra for a Happy Home",
      icon: "document",
    },
    {
      id: 3,
      title: "What is Stamp Duty and How is it Calculated?",
      icon: "document",
    },
    {
      id: 4,
      title: "Lucknow's Metro Network: A Homebuyer's Guide",
      icon: "document",
    },
    {
      id: 5,
      title: "LDA vs. RERA: What You Need to Know",
      icon: "document",
    },
  ]

  const legalUpdates = [
    {
      id: 1,
      title: "How to Create a Legally Binding Will?",
      type: "Watch video",
      image: "/legal-document-stack.png",
    },
    {
      id: 2,
      title: "The Importance of a Clear Title Deed",
      type: "Read article",
      image: "/conveyance-deed.jpg",
    },
  ]

  const nextAgentCarousel = () => {
    setAgentCarouselIndex((prev) => (prev + 1) % agents.length)
  }

  const nextLocalityCarousel = () => {
    setLocalityCarouselIndex((prev) => (prev + 1) % (localities.length - 2))
  }

  return (
    <main className="min-h-fit bg-background">
      <Header />

      {/* Hero & Search Section */}
      <section id="hero-section" className="bg-background pt-8 pb-6 px-4 sm:px-6 md:px-8 relative z-0">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero_brightener.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay to enhance text contrast */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side: Content */}
            <div className="flex-1">
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
                      selectedTab === tab ? "text-primary" : "text-white/80 hover:text-primary hover:scale-105"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <Link 
                  href="/list-property"
                  ref={(el) => { tabRefs.current["Post Free Property Ad"] = el }}
                  onMouseEnter={() => setHoveredTab("Post Free Property Ad")}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="relative whitespace-nowrap text-sm md:text-base font-semibold pb-1.5 text-white/80 hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Post Free Property Ad
                </Link>
                
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
              <div className="w-full max-w-4xl">
                <SearchBar activeFilter={selectedTab} />
              </div>
            </div>

            {/* Right side: Carousel */}
            <div className="hidden md:block md:order-last">
              <PropertyCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Cards Section */}
      <section className="bg-accent/20 py-4 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-foreground font-bold text-base md:text-lg mb-3 md:mb-6">Discover Properties in Lucknow</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {quickCards.map((card) => (
              <Link
                key={card.id}
                href={card.id === 1 ? "/search?q=Lucknow" : card.id === 2 ? "/about" : card.id === 3 ? "/search?purpose=sale" : "/search?ownerType=owner"}
                className={`${card.bgColor} rounded-lg p-3 md:p-6 cursor-pointer hover:shadow-md transition-shadow active:scale-95 touch-manipulation block`}
              >
                <p className="text-primary font-bold text-sm md:text-lg mb-1 md:mb-2 leading-tight">{card.title}</p>
                <p className="text-primary text-xs md:text-sm hover:underline line-clamp-1">{card.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section with Stacked Cards */}
      <section className="bg-background py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Featured Projects</h2>
            <Link href="/search?purpose=sale" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base">
              See all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {featuredProjects.map((project) => (
              <div key={project.id} className="min-w-[240px] snap-start flex-shrink-0 md:min-w-[280px]">
                <FeaturedStackCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending in Lucknow section */}
      <section className="bg-accent/20 py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Trending in Lucknow</h2>
            <Link href="/search?purpose=sale" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base">
              See all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {trendingFeed.length === 0 && <div className="min-w-full">{renderEmptyState("trending properties")}</div>}
            {trendingFeed.map((property, index) => {
              const isPlaceholder = property.id?.toString().startsWith('placeholder-')
              const href = isPlaceholder ? `/property/placeholder/${property.id}` : (property.id ? `/property/${property.id}` : "/list-property")
              return (
                <Link key={`${property.id || index}-${index}`} href={href} className="min-w-[280px] snap-start flex-shrink-0">
                <div className="cursor-pointer active:scale-95 transition-transform touch-manipulation">
                  <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                    {!isPlaceholder && <LikeButton propertyId={property.id} initialLiked={property.isLiked} />}
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.bhk}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                      {property.imageCount || "0"}
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
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Localities section */}
      <section className="bg-background py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-8">Popular Localities in Lucknow</h2>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory" data-locality-scroll>
              {/* Locality cards */}
              {localities.map((locality) => (
                <div
                  key={locality.id}
                  className="bg-card border border-border rounded-lg p-4 min-w-[280px] snap-start active:scale-95 transition-transform touch-manipulation"
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
            <button
              onClick={() => {
                const container = document.querySelector('[data-locality-scroll]');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="hidden md:block absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-lg hover:shadow-xl active:shadow-md active:scale-95 z-10 touch-manipulation"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Top Agents in Lucknow section */}
      <section className="bg-accent/20 py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Ganj Trusted Agents in Lucknow</h2>
            <Link href="/search?ownerType=agent" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base">
              See all →
            </Link>
          </div>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory" data-agent-scroll>
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agent/${agent.id}`}
                  className="bg-card rounded-lg p-6 min-w-[280px] snap-start active:scale-95 transition-transform touch-manipulation flex-shrink-0"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
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
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('[data-agent-scroll]');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="hidden md:block absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 bg-background rounded-full p-2 shadow-lg active:shadow-md active:scale-95 z-10 touch-manipulation"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Exclusive Owner Properties section */}
      <section className="bg-background py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Exclusive Owner Properties in Lucknow</h2>
            <Link href="/search?purpose=sale" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base">
              See all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {exclusiveFeed.length === 0 && <div className="min-w-full">{renderEmptyState("exclusive listings")}</div>}
            {exclusiveFeed.map((property, index) => {
              const isPlaceholder = property.id?.toString().startsWith('placeholder-')
              const href = isPlaceholder ? `/property/placeholder/${property.id}` : (property.id ? `/property/${property.id}` : "/list-property")
              return (
                <Link key={`${property.id || index}-${index}`} href={href} className="min-w-[280px] snap-start flex-shrink-0">
                <div className="cursor-pointer active:scale-95 transition-transform touch-manipulation">
                  <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                    {!isPlaceholder && <LikeButton propertyId={property.id} initialLiked={property.isLiked} />}
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.bhk}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                      {property.imageCount || "0"}
                    </div>
                  </div>
                  <p className="text-muted-foreground font-semibold mb-1">{property.bhk}</p>
                  <p className="text-foreground font-bold">
                    {property.price} <span className="text-muted-foreground font-normal text-sm">| {property.sqft}</span>
                  </p>
                </div>
              </Link>
              )
            })}
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
              <h3 className="text-xl font-bold text-foreground mb-4">Property Ganj Insights</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/1" className="text-muted-foreground text-sm">Understanding Circle Rates in Lucknow</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/2" className="text-muted-foreground text-sm">Vastu Shastra for a Happy Home</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/3" className="text-muted-foreground text-sm">What is Stamp Duty and How is it Calculated?</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/4" className="text-muted-foreground text-sm">Lucknow's Metro Network: A Homebuyer's Guide</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/5" className="text-muted-foreground text-sm">LDA vs. RERA: What You Need to Know</Link>
                </li>
              </ul>
              <Link href="/blog" className="text-primary font-semibold text-sm mt-6 inline-block hover:underline active:opacity-70 touch-manipulation">
                See all →
              </Link>
            </div>

            {/* Loan & Finance */}
            <div className="border-2 border-primary rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Loan & Finance</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/1" className="text-muted-foreground text-sm">Home Loan Eligibility: How to Check Your Qualification</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/2" className="text-muted-foreground text-sm">Interest Rates and EMI Calculations: A Complete Guide</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/3" className="text-muted-foreground text-sm">Top Banks for Home Loans in Lucknow: Compare Interest Rates</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/4" className="text-muted-foreground text-sm">Home Loan Documents: Complete Checklist for Property Buyers</Link>
                </li>
                <li className="flex items-start gap-3 cursor-pointer hover:text-primary transition-colors">
                  <span className="text-primary text-xl">●</span>
                  <Link href="/blog/5" className="text-muted-foreground text-sm">Pre-EMI vs Full EMI: Which Option is Right for You?</Link>
                </li>
              </ul>
              <Link href="/loan-finance" className="text-primary font-semibold text-sm mt-6 inline-block hover:underline">
                See all →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Owner Properties */}
      <section className="bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Popular Owner Properties</h2>
            <Link href="/search?purpose=sale" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation">
              See all Properties →
            </Link>
          </div>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory" data-popular-scroll>
              {popularFeed.length === 0 && <div className="min-w-full">{renderEmptyState("popular listings")}</div>}
            {popularFeed.map((property, index) => {
              const isPlaceholder = property.id?.toString().startsWith('placeholder-')
              const href = isPlaceholder ? `/property/placeholder/${property.id}` : (property.id ? `/property/${property.id}` : "/list-property")
              return (
                <Link key={`${property.id || index}-${index}`} href={href} className="min-w-[280px] snap-start flex-shrink-0">
                  <div className="cursor-pointer active:scale-95 transition-transform touch-manipulation">
                    <div className="relative mb-3 bg-muted rounded-lg overflow-hidden h-48">
                      {!isPlaceholder && <LikeButton propertyId={property.id} initialLiked={property.isLiked} />}
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.bhk}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                        {property.imageCount || "0"}
                      </div>
                    </div>
                    <p className="text-muted-foreground font-semibold mb-1">{property.bhk}</p>
                    <p className="text-foreground font-bold">
                      {property.price} <span className="text-muted-foreground font-normal text-sm">| {property.sqft}</span>
                    </p>
                  </div>
                </Link>
                )
              })}
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('[data-popular-scroll]');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-background rounded-full p-2 shadow-lg hover:shadow-xl active:shadow-md active:scale-95 touch-manipulation"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
