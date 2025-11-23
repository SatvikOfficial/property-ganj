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
import FeaturedBuildersClient from "@/components/FeaturedBuildersClient"
import PremiumProjectsClient from "@/components/PremiumProjectsClient"
import RecommendedProperties from "@/components/RecommendedProperties"
import { TOOL_DEFINITIONS } from "@/data/tools"
import { POPULAR_LUCKNOW_LOCALITIES } from "@/data/lucknowLocalities"
import { SAMPLE_BUILDERS } from "@/data/sampleBuilders"

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("Buy")
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [agentCarouselIndex, setAgentCarouselIndex] = useState(0)
  const [localityCarouselIndex, setLocalityCarouselIndex] = useState(0)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [liveProperties, setLiveProperties] = useState<any[]>([])
  const [likedProperties, setLikedProperties] = useState<string[]>([])
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | HTMLAnchorElement | null }>({})

  const propertyTabs = ["Buy", "Rent", "New Projects", "Plot", "Commercial"]
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

  // Hardcoded, deterministic fallback images (one per card position)
  const hardcodedFallbackImages = [
    '/apartment-complex.jpg',
    '/residential-plots.jpg',
    '/featured-property.jpg',
    '/modern-apartment.jpg',
    '/2bhk-apartment.jpg',
    '/3bhk-apartment.jpg',
    '/4bhk-apartment.jpg',
    '/luxury-apartment.jpg',
    '/residential-property.jpg',
    '/2bhk-flat.jpg',
    '/3bhk-flat.jpg',
    '/premium-apartment.jpg',
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
    const fetchLiveProperties = async () => {
      try {
        const response = await fetch('/api/properties?limit=12')
        const data = await response.json()
        if (response.ok) {
          const fetchedProperties = data.properties || []
          // Add placeholders if we have less than 12 properties
          if (fetchedProperties.length < 12) {
            const placeholders = generatePlaceholderProperties(12 - fetchedProperties.length)
            setLiveProperties([...fetchedProperties, ...placeholders])
          } else {
            setLiveProperties(fetchedProperties)
          }
        } else {
          // Show placeholders even on error
          setLiveProperties(generatePlaceholderProperties(12))
        }
      } catch (error) {
        console.error('Failed to load live properties', error)
        // Show placeholders on error
        setLiveProperties(generatePlaceholderProperties(12))
      }
    }

    const fetchLikedProperties = async () => {
      try {
        const response = await fetch('/api/profile/liked-properties')
        if (response.ok) {
          const data = await response.json()
          setLikedProperties(data.likedProperties.map((p: any) => p._id))
        }
      } catch (error) {
        console.error('Failed to load liked properties', error)
      }
    }

    fetchLiveProperties()
    fetchLikedProperties()
  }, [])

  const formatPrice = (value?: number) => {
    if (!value) return '₹ —'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const derivedProperties = liveProperties.map((property, idx) => {
    const id = property._id?.toString?.() ?? property.id ?? ''

    const normalizeUrl = (u: any) => {
      if (!u) return null
      if (typeof u !== 'string') return null
      if (u.startsWith('http://') || u.startsWith('https://')) return u
      return u.startsWith('/') ? u : `/${u}`
    }

    // Prefer media photos, then coverImage, otherwise use a shuffled fallback image
    let firstMediaUrl = normalizeUrl(property.media?.photos?.[0]?.url)

    // Sanitize broken seed images
    if (firstMediaUrl && firstMediaUrl.includes('/properties/sample-')) {
      firstMediaUrl = null
    }

    const cover = normalizeUrl(property.coverImage)
    const fallback = hardcodedFallbackImages[idx % hardcodedFallbackImages.length]

    const image = firstMediaUrl || cover || fallback || '/placeholder.svg'

    return {
      id,
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
      image,
      isLiked: likedProperties.includes(id),
    }
  })

  const trendingFeed = derivedProperties.slice(0, 4)
  const exclusiveFeed = derivedProperties.slice(4, 8)
  const popularFeed = derivedProperties.slice(8, 12)
  // Recommended feed - using a mix or specific slice
  const recommendedFeed = derivedProperties.slice(2, 6)

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
      title: "Commercial Spaces & Offices",
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

  const localities = POPULAR_LUCKNOW_LOCALITIES.slice(0, 4).map((locality, index) => ({
    id: index + 1,
    name: locality.label,
    slug: locality.label.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
    priceRange: `₹${(locality.insights?.averagePricePerSqft ?? 4000) * 0.5} - ₹${(locality.insights?.averagePricePerSqft ?? 8000) * 1.5} per sqft`,
    rating: locality.insights?.safetyRating ?? 4.0,
    reviews: locality.insights?.ranking ? (20 - locality.insights?.ranking) * 20 + 10 : 100,
    properties: locality.insights?.ranking ? (20 - locality.insights?.ranking) * 50 + 20 : 200,
    image: `/kanpur-road-locality.jpg`, // default image
  }));

  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents')
        const data = await res.json()
        if (data.agents && data.agents.length > 0) {
          const formattedAgents = data.agents.map((agent: any) => ({
            id: agent._id,
            name: agent.name,
            company: agent.agentProfile?.specialization || 'Real Estate Agent',
            since: new Date().getFullYear() - (agent.agentProfile?.experience || 0),
            buyers: '50+',
            propertiesSale: 10,
            propertiesRent: 5,
            // Support multiple possible field names for agent photo coming from seed/data or API
            image:
              agent.agentProfile?.photoUrl ||
              agent.agentProfile?.profileImage ||
              agent.agentProfile?.profileImageUrl ||
              "/agent-profile-photo.jpg",
          }))
          setAgents(formattedAgents)
        } else {
          setAgents([
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
          ])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchAgents()
  }, [])

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
    <main className="min-h-fit bg-background overflow-x-hidden">
      <Header />

      {/* Hero & Search Section */}
      <section id="hero-section" className="bg-background pt-8 pb-6 px-4 sm:px-6 md:px-8 relative">
        {/* Video Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/hero_brightener.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay to enhance text contrast */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
            {/* Left side: Content */}
            <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex item from overflowing */}
              <DynamicGreeting />

              {/* Property Type Tabs */}
              <div className="relative flex gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6 mt-4 overflow-x-auto pb-1">
                {propertyTabs.map((tab) => (
                  <button
                    key={tab}
                    ref={(el) => { tabRefs.current[tab] = el }}
                    onClick={() => setSelectedTab(tab)}
                    onMouseEnter={() => setHoveredTab(tab)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`relative whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg font-semibold pb-1.5 transition-all duration-300 ${selectedTab === tab ? "text-primary" : "text-white/80 hover:text-primary hover:scale-105"
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
                  className="relative whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg font-semibold pb-1.5 text-white/80 hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Post Free Property Ad
                </Link>
                <Link
                  href="/agent-registration"
                  ref={(el) => { tabRefs.current["Register as Agent"] = el }}
                  onMouseEnter={() => setHoveredTab("Register as Agent")}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="relative whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg font-semibold pb-1.5 text-white/80 hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Register as Agent
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
              <div className="w-full max-w-full md:max-w-2xl lg:max-w-4xl">
                <SearchBar activeFilter={selectedTab} />
              </div>
            </div>

            {/* Right side: Carousel */}
            <div className="hidden md:hidden lg:block lg:order-last self-start"> {/* self-start to align to top */}
              <PropertyCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Cards Section */}
      <section className="bg-accent/20 py-4 md:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-foreground font-bold text-base md:text-lg lg:text-xl mb-3 md:mb-6">Discover Properties in Lucknow</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {quickCards.map((card) => (
              <Link
                key={card.id}
                href={card.id === 1 ? "/search?q=Lucknow" : card.id === 2 ? "/about" : card.id === 3 ? "/search?purpose=sale" : "/search?ownerType=owner"}
                className={`${card.bgColor} rounded-lg p-3 md:p-4 lg:p-6 cursor-pointer hover:shadow-md transition-shadow active:scale-95 touch-manipulation block`}
              >
                <p className="text-primary font-bold text-sm md:text-base lg:text-lg mb-1 md:mb-2 leading-tight">{card.title}</p>
                <p className="text-primary text-xs md:text-sm lg:text-base hover:underline line-clamp-1">{card.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="bg-background py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Featured Projects</h2>
            <Link href="/projects" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base lg:text-lg">
              See all →
            </Link>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {featuredProjects.map((project) => (
              <div key={project.id} className="snap-center flex-shrink-0">
                <FeaturedStackCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Builders & Projects Section */}
      <section className="bg-background py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 md:mb-12 text-center">Featured Builders & Projects</h2>

          {/* Featured Builders Sub-section */}
          <div className="mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Featured Builders</h3>
              <Link href="/builders" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base lg:text-lg">
                See all →
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
              <FeaturedBuildersClient />
            </div>
          </div>

          {/* Premium Projects Sub-section (Light Blue Aesthetic) */}
          <div className="bg-blue-50/50 rounded-3xl p-6 md:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Premium Projects</h3>
                <p className="text-slate-600">Handpicked exclusive developments for you</p>
              </div>
              <Link href="/projects" className="text-blue-600 font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base lg:text-lg flex items-center gap-1">
                View All Projects <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <PremiumProjectsClient />
          </div>
        </div>
      </section>

      {/* Recommended for You Section */}
      <RecommendedProperties />

      {/* Tools Section */}
      <section className="bg-gradient-to-br from-background via-accent/10 to-background py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold">TOOLS</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Plan your finances in minutes</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                EMIs, mortgages, rental budgets or investment yields — pick the calculator that suits your journey.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-primary hover:gap-3 transition-all duration-300"
            >
              Explore all tools →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOOL_DEFINITIONS.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="card-premium group p-6 flex flex-col gap-4 hover:shadow-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <Icon className="w-6 h-6 md:w-7 md:h-7" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase text-primary font-semibold mb-1">{tool.highlight}</p>
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="flex items-center text-primary text-sm md:text-base font-semibold group-hover:gap-2 transition-all">
                    Calculate now
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Localities section */}
      <section className="bg-background py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 md:mb-10">Popular Localities in Lucknow</h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory" data-locality-scroll>
              {/* Locality cards */}
              {localities.map((locality) => (
                <Link href={`/locality/${locality.slug}`} key={locality.id}>
                  <div
                    className="card-premium p-6 min-w-[300px] lg:min-w-[350px] snap-start group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-foreground text-xl lg:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                        {locality.name}
                        <span className="text-primary text-sm lg:text-base">↗</span>
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 font-medium">{locality.priceRange}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.floor(locality.rating) ? 'text-accent' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">{locality.rating}</span>
                      <span className="text-muted-foreground text-sm md:text-base">({locality.reviews} Reviews)</span>
                    </div>
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 text-center group-hover:from-primary/10 group-hover:to-secondary/10 transition-all">
                      <p className="text-primary font-bold text-base md:text-lg">{locality.properties} Properties for Sale →</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('[data-locality-scroll]');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="hidden md:flex absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 z-10 transition-all items-center justify-center border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Top Agents in Lucknow section */}
      <section className="bg-gradient-to-br from-accent/20 via-accent/10 to-accent/20 py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ganj Trusted Agents in Lucknow</h2>
            <Link href="/search?ownerType=agent" className="text-primary font-semibold hover:gap-2 flex items-center gap-1 transition-all text-sm md:text-base">
              See all →
            </Link>
          </div>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory" data-agent-scroll>
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agent/${agent.id}`}
                  className="card-premium p-6 min-w-[320px] snap-start group flex-shrink-0"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative">
                      <img
                        src={agent.image || "/placeholder.svg"}
                        alt={agent.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{agent.company}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-border">
                    <div className="text-center p-3 bg-gradient-to-br from-primary/5 to-transparent rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Operating Since</p>
                      <p className="font-bold text-foreground text-lg">{agent.since}</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-secondary/5 to-transparent rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Buyers Served</p>
                      <p className="font-bold text-foreground text-lg">{agent.buyers}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="font-bold text-primary text-2xl mb-1">{agent.propertiesSale}</p>
                      <p className="text-xs text-muted-foreground">For Sale</p>
                    </div>
                    {agent.propertiesRent > 0 && (
                      <div className="text-center">
                        <p className="font-bold text-secondary text-2xl mb-1">{agent.propertiesRent}</p>
                        <p className="text-xs text-muted-foreground">For Rent</p>
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
              className="hidden md:flex absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 z-10 transition-all items-center justify-center border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Commercial Spaces & Offices section */}
      <section className="bg-background py-6 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Commercial Spaces & Offices</h2>
            <Link href="/search?propertyType=Commercial" className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base lg:text-lg">
              See all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {exclusiveFeed.length === 0 && <div className="min-w-full">{renderEmptyState("exclusive listings")}</div>}
            {exclusiveFeed.map((property, index) => {
              const isPlaceholder = property.id?.toString().startsWith('placeholder-')
              const href = isPlaceholder ? `/property/placeholder/${property.id}` : (property.id ? `/property/${property.id}` : "/list-property")
              return (
                <Link key={`${property.id || index}-${index}`} href={href} className="min-w-[280px] snap-start flex-shrink-0 lg:min-w-[320px]">
                  <div className="card-premium cursor-pointer group overflow-hidden">
                    <div className="relative mb-3 bg-muted rounded-t-2xl overflow-hidden h-52 md:h-60 lg:h-64 image-overlay">
                      {!isPlaceholder && <LikeButton propertyId={property.id} initialLiked={property.isLiked} />}
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.bhk}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                        {property.imageCount || "0"}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground font-semibold mb-2 text-sm md:text-base">{property.bhk}</p>
                      <p className="text-foreground font-bold text-lg md:text-xl mb-1">
                        {property.price}
                      </p>
                      <p className="text-muted-foreground text-sm md:text-base">{property.sqft} sqft</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Your Real Estate Guide section */}
      <section className="bg-gradient-to-br from-background via-accent/5 to-background py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Your Real Estate Guide</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Industry Insights */}
            <div className="card-premium p-8 border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Property Ganj Insights</h3>
              </div>
              <ul className="space-y-4">
                <li className="group">
                  <Link href="/blog/1" className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all">
                    <span className="text-primary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-primary transition-colors font-medium">Understanding Circle Rates in Lucknow</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/2" className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all">
                    <span className="text-primary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-primary transition-colors font-medium">Vastu Shastra for a Happy Home</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/3" className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all">
                    <span className="text-primary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-primary transition-colors font-medium">What is Stamp Duty and How is it Calculated?</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/4" className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all">
                    <span className="text-primary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-primary transition-colors font-medium">Lucknow's Metro Network: A Homebuyer's Guide</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/5" className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all">
                    <span className="text-primary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-primary transition-colors font-medium">LDA vs. RERA: What You Need to Know</span>
                  </Link>
                </li>
              </ul>
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold text-base mt-6 hover:gap-3 transition-all">
                See all articles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Loan & Finance */}
            <div className="card-premium p-8 border-l-4 border-secondary">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Loan & Finance</h3>
              </div>
              <ul className="space-y-4">
                <li className="group">
                  <Link href="/blog/1" className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-all">
                    <span className="text-secondary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-secondary transition-colors font-medium">Home Loan Eligibility: How to Check Your Qualification</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/2" className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-all">
                    <span className="text-secondary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-secondary transition-colors font-medium">Interest Rates and EMI Calculations: A Complete Guide</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/3" className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-all">
                    <span className="text-secondary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-secondary transition-colors font-medium">Top Banks for Home Loans in Lucknow: Compare Interest Rates</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/4" className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-all">
                    <span className="text-secondary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-secondary transition-colors font-medium">Home Loan Documents: Complete Checklist for Property Buyers</span>
                  </Link>
                </li>
                <li className="group">
                  <Link href="/blog/5" className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-all">
                    <span className="text-secondary text-lg mt-1 group-hover:scale-125 transition-transform">→</span>
                    <span className="text-foreground text-base group-hover:text-secondary transition-colors font-medium">Pre-EMI vs Full EMI: Which Option is Right for You?</span>
                  </Link>
                </li>
              </ul>
              <Link href="/loan-finance" className="inline-flex items-center gap-2 text-secondary font-bold text-base mt-6 hover:gap-3 transition-all">
                Explore loan options
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
