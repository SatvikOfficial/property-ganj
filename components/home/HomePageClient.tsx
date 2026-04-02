"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Building2, Users, Crown, Sparkles, ArrowUpRight, MapPin, BookOpen, Landmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import HomeHero from "@/components/home/HomeHero"
import FeaturedProjectsShowcase from "@/components/home/FeaturedProjectsShowcase"
import LikeButton from "@/components/LikeButton"
import { useCity } from "@/components/CityContext"
import { createClient } from "@/utils/supabase/client"
import {
  PROPERTY_GANJ_SUBDIVISIONS,
  getPropertyGanjSubdivisionFromProperty,
  getPropertyGanjSubdivisionMeta,
  isFeaturedAddressLine2,
  isPropertyGanjAddressLine2,
  type PropertyGanjSubdivision,
} from "@/lib/property-ganj"

const propertyGanjSectionStyles: Record<
  PropertyGanjSubdivision,
  { shell: string; badge: string; count: string; border: string }
> = {
  pg: {
    shell: "bg-[linear-gradient(135deg,#fff6e8_0%,#fffdf7_60%,#fff2d9_100%)]",
    badge: "bg-amber-100 text-amber-700",
    count: "bg-white/90 text-amber-700",
    border: "border-amber-200/70",
  },
  "flats-apartment": {
    shell: "bg-[linear-gradient(135deg,#f5f8ff_0%,#ffffff_58%,#eef4ff_100%)]",
    badge: "bg-sky-100 text-sky-700",
    count: "bg-white/90 text-sky-700",
    border: "border-sky-200/70",
  },
  "houses-villa": {
    shell: "bg-[linear-gradient(135deg,#f6fff8_0%,#ffffff_58%,#eaf8ee_100%)]",
    badge: "bg-emerald-100 text-emerald-700",
    count: "bg-white/90 text-emerald-700",
    border: "border-emerald-200/70",
  },
  plot: {
    shell: "bg-[linear-gradient(135deg,#fff8ef_0%,#ffffff_58%,#fef0dd_100%)]",
    badge: "bg-orange-100 text-orange-700",
    count: "bg-white/90 text-orange-700",
    border: "border-orange-200/70",
  },
  office: {
    shell: "bg-[linear-gradient(135deg,#f4f7fb_0%,#ffffff_58%,#edf2f7_100%)]",
    badge: "bg-slate-200 text-slate-700",
    count: "bg-white/90 text-slate-700",
    border: "border-slate-200/80",
  },
  shop: {
    shell: "bg-[linear-gradient(135deg,#fff7f3_0%,#ffffff_58%,#ffece1_100%)]",
    badge: "bg-rose-100 text-rose-700",
    count: "bg-white/90 text-rose-700",
    border: "border-rose-200/70",
  },
  "commercial-land": {
    shell: "bg-[linear-gradient(135deg,#f7f9ef_0%,#ffffff_58%,#eef3df_100%)]",
    badge: "bg-lime-100 text-lime-700",
    count: "bg-white/90 text-lime-700",
    border: "border-lime-200/80",
  },
}

export default function HomePage() {
  const [liveProperties, setLiveProperties] = useState<any[]>([])
  const [likedProperties, setLikedProperties] = useState<string[]>([])
  const [liveAgents, setLiveAgents] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { cityConfig } = useCity()
  const cityName = cityConfig.name

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
    const fetchProperties = async () => {
      try {
        const supabase = createClient();
        
        // Fetch agents
        const { data: dbAgents } = await supabase.from('profiles').select('*').eq('role', 'agent').limit(4);
        if (dbAgents) setLiveAgents(dbAgents);

        const { data: properties, error } = await supabase
          .from('properties')
          .select('*')
          .limit(100)
          .order('created_at', { ascending: false });
          
        if (!error && properties && properties.length > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
             setCurrentUser(user);
             const { data: likes } = await supabase.from('likes').select('property_id').eq('user_id', user.id);
             if (likes) {
                setLikedProperties(likes.map(l => l.property_id));
             }
          }
          
          const ownerIds = properties.map(p => p.owner_user_id).filter(Boolean);
          if (ownerIds.length > 0) {
            const { data: profiles } = await supabase.from('profiles').select('user_id, role, full_name, phone').in('user_id', ownerIds);
            properties.forEach(p => {
               const profile = profiles?.find(prof => prof.user_id === p.owner_user_id);
               p.owner_role = profile?.role;
               p.owner_name = profile?.full_name;
               p.owner_phone = profile?.phone;
            });
          }
          
          setLiveProperties(properties);
          return;
        }
      } catch (err) {}
      
      setLiveProperties(generatePlaceholderProperties(12));
      setLikedProperties([]);
      setLiveAgents([]);
    };

    fetchProperties();
  }, [])

  const formatPrice = (value?: number) => {
    if (!value) return '₹ —'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const derivedProperties = liveProperties.map((property) => {
    const fallbackImages = ["/modern-apartment.jpg", "/2bhk-flat.jpg", "/luxury-apartment-living-room.png", "/residential-property.jpg", "/residential-plots-green.jpg"];
    const idHash = property._id?.toString?.() ?? property.id ?? '';
    let hashNum = 0;
    for (let i = 0; i < idHash.length; i++) hashNum += idHash.charCodeAt(i);
    const defaultImg = fallbackImages[hashNum % fallbackImages.length];

    const bedrooms = property.bedrooms || property.specs?.bedrooms;
    const propertyType = property.propertyType || property.property_type || 'Property';

    return {
      id: idHash,
      bhk: bedrooms ? `${bedrooms} BHK ${propertyType}` : propertyType,
      price: formatPrice(property.price || property.rent),
      sqft: property.carpet_area_sqft || property.specs?.carpetArea || property.specs?.builtUpArea || property.built_up_area_sqft || '—',
      location: property.location?.locality || property.locality || property.formatted_address || [property.location?.city || property.city].filter(Boolean).join(', ') || "Lucknow",
      status: (property.purpose || property.listing_type || property.for_rent) ? 'Available for Rent' : 'Available',
      imageCount: property.media?.photos?.length || property.images?.length || 1,
      image: property.provider || property.media?.photos?.[0]?.url || property.images?.[0] || defaultImg,
      isLiked: likedProperties.includes(idHash),
      ownerType: property.owner_role || 'user',
      ownerId: property.owner_user_id,
      contactName: property.owner_name || property.contact?.name || 'Verified Lister',
      rawStatus: property.status,
      address_line2: property.address_line2,
      title: property.title,
      propertyType,
      description: property.description,
    };
  })

  // === Section Feeds ===
  const agentFeed = derivedProperties.filter(p => p.ownerType === 'agent');
  const ownerFeed = derivedProperties.filter(p => p.ownerType === 'user' || p.ownerType === 'builder');

  // Property Ganj listings from properties table
  const pgListingsRaw = derivedProperties.filter(p => isPropertyGanjAddressLine2(p.address_line2));
  const regularFeaturedRaw = derivedProperties.filter(p => isFeaturedAddressLine2(p.address_line2));

  const featuredProjects = [
    { id: 1, name: "Kalyan Garden View", location: "Indira Nagar, Lucknow", type: "3 BHK Flats", price: "₹80.3 Lac onwards", builder: "by Krishna Colonisers", image: "/apartment-complex.jpg" },
    { id: 2, name: "Property Boss Green Park City", location: "Sultanpur Road, Lucknow", type: "Residential Plots", price: "₹7.6 Lac onwards", builder: "by Property Boss Real Infrastructure LLP", image: "/residential-plots.jpg" },
    { id: 3, name: "Sahu City Phase 2", location: "Sultanpur Road, Lucknow", type: "2, 3 BHK Flats", price: "₹57.9 Lac onwards", builder: "by Sahu Land Developers Pvt Ltd", image: "/featured-property.jpg" },
    { id: 4, name: "Excella Kutumb", location: "Sultanpur Road, Lucknow", type: "2 BHK Flats", price: "₹51.5 Lac onwards", builder: "by Township Experts", image: "/modern-apartment.jpg" },
  ]

  let displayFeaturedProjects = featuredProjects as any[];
  if (regularFeaturedRaw.length > 0) {
    displayFeaturedProjects = regularFeaturedRaw.slice(0, 4).map(p => ({
      id: p.id, name: p.title || p.bhk, location: p.location, type: p.bhk, price: p.price,
      builder: "Verified Featured Listing", image: p.image, isLiked: p.isLiked
    }));
  }

  const displayPgListings = pgListingsRaw.map((p) => {
    const subdivision = getPropertyGanjSubdivisionFromProperty({
      addressLine2: p.address_line2,
      propertyType: p.propertyType,
      title: p.title,
      type: p.bhk,
      description: p.description,
    }) || "flats-apartment"

    return {
      id: p.id,
      name: p.title || p.bhk,
      location: p.location,
      type: p.bhk,
      price: p.price,
      image: p.image,
      isLiked: p.isLiked,
      subdivision,
      subdivisionMeta: getPropertyGanjSubdivisionMeta(subdivision),
    }
  });

  const displayPgSections = PROPERTY_GANJ_SUBDIVISIONS.map((section) => ({
    ...section,
    listings: displayPgListings.filter((listing) => listing.subdivision === section.id),
  })).filter((section) => section.listings.length > 0)

  const localities = [
    { id: 1, name: "Kanpur Road", priceRange: "₹2,509 - ₹12,500 per sqft", rating: 3.9, reviews: 127, properties: 193, image: "/kanpur-road-locality.jpg" },
    { id: 2, name: "Sushant Golf City", priceRange: "₹4,904 - ₹12,500 per sqft", rating: 4.4, reviews: 139, properties: 727, image: "/sushant-golf-city.jpg" },
    { id: 3, name: "Kishan Path", priceRange: "₹2,737 - ₹12,500 per sqft", rating: 4.1, reviews: 28, properties: 89, image: "/kishan-path.jpg" },
    { id: 4, name: "IIM Road", priceRange: "₹3,200 - ₹15,000 per sqft", rating: 4.3, reviews: 156, properties: 412, image: "/iim-road.jpg" },
  ]

  const agents = [
    { id: 1, name: "Vivid Infra", company: "Vivid Infra Land Pvt Ltd", since: 2012, buyers: "1000+", propertiesSale: 65, propertiesRent: 0, image: "/agent-profile-photo.jpg" },
    { id: 2, name: "Saurabh Gupta", company: "Safe Invest Realty", since: 2012, buyers: "100+", propertiesSale: 56, propertiesRent: 0, image: "/agent-profile.png" },
    { id: 3, name: "Rahul Juyal", company: "Pratham Realty Solutions", since: 2011, buyers: "4000+", propertiesSale: 71, propertiesRent: 0, image: "/agent-photo.jpg" },
    { id: 4, name: "Shiyaram Singh", company: "S.R. Broker LLP", since: 2017, buyers: "4000+", propertiesSale: 144, propertiesRent: 10, image: "/agent-profile-photo.jpg" },
  ]

  let displayAgents = agents;
  if (liveAgents.length > 0) {
    displayAgents = liveAgents.map(a => {
      const agentProps = derivedProperties.filter(p => p.ownerId === a.user_id);
      return {
        id: a.user_id,
        name: a.full_name || 'Agent',
        company: a.agent_bio ? 'Independent Agent' : 'PG Certified Agent',
        since: a.created_at ? new Date(a.created_at).getFullYear() : 2024,
        buyers: `${Math.floor(Math.random() * 50) + 10}+`,
        propertiesSale: agentProps.filter(p => p.status === 'Available').length || agentProps.length,
        propertiesRent: agentProps.filter(p => p.status === 'Available for Rent').length,
        image: a.avatar_url || agents[Math.floor(Math.random() * agents.length)].image
      };
    });
  }

  const quickCards = [
    { id: 1, title: "Over 10,000+ Properties waiting for you", subtitle: "Continue your last search", bgColor: "bg-accent/20" },
    { id: 2, title: "Share your Property Ganj story and WIN vouchers worth ₹5000", subtitle: "#MeriPropertyMeraGanj", bgColor: "bg-accent/40" },
    { id: 3, title: "Top Handpicked Projects for you", subtitle: "See all", bgColor: "bg-accent/20" },
    { id: 4, title: "Top Exclusive Owner Properties", subtitle: "See all", bgColor: "bg-accent/20" },
  ]

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

  const getPropertyHref = (propertyId?: string | number) => {
    if (!propertyId) return "/list-property"
    const normalizedId = propertyId.toString()
    return normalizedId.startsWith("placeholder-")
      ? `/property/placeholder/${normalizedId}`
      : `/property/${normalizedId}`
  }

  // Shared property card renderer
  const renderPropertyCard = (property: typeof derivedProperties[0], index: number) => {
    const isPlaceholder = property.id?.toString().startsWith("placeholder-")
    const href = getPropertyHref(property.id)
    return (
      <Link key={`${property.id || index}-${index}`} href={href} className="min-w-[280px] snap-start flex-shrink-0 group">
        <div className="cursor-pointer active:scale-[0.97] transition-all duration-300 touch-manipulation">
          <div className="relative mb-3 bg-muted rounded-xl overflow-hidden h-48 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
            {!isPlaceholder && (
              <LikeButton
                propertyId={property.id}
                initialLiked={property.isLiked}
                className="absolute right-3 top-3 z-20"
              />
            )}
            <Image
              src={property.image || "/placeholder.svg"}
              alt={property.bhk}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 bg-foreground/80 backdrop-blur-sm text-background px-2.5 py-1 rounded-lg text-xs font-semibold">
              📷 {property.imageCount || "0"}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <p className="text-muted-foreground font-semibold mb-0.5 text-sm">{property.bhk}</p>
          <p className="text-foreground font-bold text-base">
            {property.price} <span className="text-muted-foreground font-normal text-sm">| {property.sqft} sqft</span>
          </p>
          <p className="text-sm text-muted-foreground">{property.location}</p>
          <p className="text-xs text-primary font-medium mt-1">{property.contactName}</p>
        </div>
      </Link>
    )
  }

  const renderPgListingCard = (project: typeof displayPgListings[number]) => {
    const href = getPropertyHref(project.id)
    const sectionStyle = propertyGanjSectionStyles[project.subdivision]
    const isPlaceholder = project.id?.toString().startsWith("placeholder-")

    return (
      <Link
        key={project.id}
        href={href}
        className={`group flex h-full flex-col overflow-hidden rounded-[24px] border ${sectionStyle.border} bg-white/95 shadow-[0_14px_32px_rgba(16,35,36,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(16,35,36,0.12)]`}
      >
        <div className="relative h-44 overflow-hidden bg-muted">
          {!isPlaceholder && (
            <LikeButton
              propertyId={project.id}
              initialLiked={project.isLiked}
              className="absolute right-3 top-3 z-20"
            />
          )}
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
          <div className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${sectionStyle.badge}`}>
            Property Ganj
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary/75">
                {project.subdivisionMeta.label}
              </p>
              <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-foreground">{project.name}</h3>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{project.location}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {project.type}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {project.price}
            </span>
          </div>
          <p className="mt-auto pt-4 text-sm font-semibold text-foreground">View listing</p>
        </div>
      </Link>
    )
  }

  // Section header component
  const SectionHeader = ({ icon, title, subtitle, href, gradient }: { icon: React.ReactNode, title: string, subtitle?: string, href?: string, gradient: string }) => (
    <div className={`mb-6 flex items-center justify-between max-md:mb-4 md:mb-8`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${gradient} shadow-sm`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {href && (
        <Link href={href} className="text-primary font-semibold hover:underline active:opacity-70 touch-manipulation text-sm md:text-base whitespace-nowrap">
          See all →
        </Link>
      )}
    </div>
  )

  return (
    <main className="min-h-fit bg-background w-full">
      <Header />
      <HomeHero />

      {/* Featured Projects Section */}
      <section className="bg-background pb-3 max-md:pb-1 pt-0">
        <div className="w-full rounded-[32px] border border-amber-100 bg-[linear-gradient(135deg,#fff9ef_0%,#ffffff_58%,#fff1e4_100%)] p-3 max-md:rounded-[26px] max-md:p-2.5 shadow-[0_18px_60px_rgba(235,98,57,0.08)] sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-4 max-md:mb-2.5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-2.5 max-md:p-2 shadow-sm">
                <Sparkles className="h-5 w-5 max-md:h-4 max-md:w-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl max-md:text-lg font-bold text-foreground md:text-2xl">Featured Projects</h2>
                <p className="text-xs text-muted-foreground max-md:hidden md:text-sm">
                  Auto-rotating spotlight so every signature listing gets attention.
                </p>
              </div>
            </div>
            <Link
              href="/search?purpose=sale"
              className="whitespace-nowrap text-sm max-md:text-[13px] font-semibold text-primary transition hover:underline md:text-base"
            >
              See all →
            </Link>
          </div>
          <FeaturedProjectsShowcase
            projects={displayFeaturedProjects}
            getPropertyHref={getPropertyHref}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 1: Listed by Property Ganj */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden py-8 max-md:py-6 md:py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-[#264143]/5 via-primary/5 to-[#264143]/5" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20" />
        <div className="relative z-10 w-full">
          <SectionHeader
            icon={<Crown className="w-5 h-5 text-primary" />}
            title="Listed by Property Ganj"
            subtitle="Premium curated listings by our team"
            href={undefined}
            gradient="bg-primary/10"
          />
          {displayPgSections.length > 0 ? (
            <div className="space-y-6 max-md:space-y-5">
              <div className="pg-mobile-scroll-row md:hidden">
                {displayPgSections.slice(0, 3).map((section) => {
                  const style = propertyGanjSectionStyles[section.id]
                  return (
                    <div
                      key={section.id}
                      className={`min-w-[82vw] max-w-[20rem] shrink-0 snap-start rounded-[24px] border ${style.border} ${style.shell} p-4 shadow-[0_16px_34px_rgba(16,35,36,0.06)]`}
                    >
                      <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style.badge}`}>
                        {section.label}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-foreground">{section.listings.length} live listing{section.listings.length > 1 ? "s" : ""}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  )
                })}
              </div>

              <div className="hidden gap-3 md:grid md:grid-cols-3">
                {displayPgSections.slice(0, 3).map((section) => {
                  const style = propertyGanjSectionStyles[section.id]
                  return (
                    <div
                      key={section.id}
                      className={`rounded-[24px] border ${style.border} ${style.shell} p-4 shadow-[0_16px_34px_rgba(16,35,36,0.06)]`}
                    >
                      <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style.badge}`}>
                        {section.label}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-foreground">{section.listings.length} live listing{section.listings.length > 1 ? "s" : ""}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-5">
                {displayPgSections.map((section) => {
                  const style = propertyGanjSectionStyles[section.id]
                  return (
                    <div
                      key={section.id}
                      className={`rounded-[30px] border ${style.border} ${style.shell} p-4 shadow-[0_18px_40px_rgba(16,35,36,0.06)] md:p-5`}
                    >
                      <div className="mb-5 flex flex-col gap-3 border-b border-black/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${style.badge}`}>
                            Property Ganj Curated
                          </p>
                          <h3 className="mt-3 text-2xl max-md:text-xl font-semibold text-foreground">{section.label}</h3>
                          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{section.description}</p>
                        </div>
                        <div className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold ${style.count}`}>
                          {section.listings.length} active
                        </div>
                      </div>

                      <div className="pg-mobile-scroll-row md:hidden">
                        {section.listings.map((project) => (
                          <div key={project.id} className="min-w-[84vw] max-w-[22rem] shrink-0 snap-start">
                            {renderPgListingCard(project)}
                          </div>
                        ))}
                      </div>

                      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                        {section.listings.map((project) => renderPgListingCard(project))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="bg-card/80 backdrop-blur-sm border border-dashed border-primary/30 rounded-2xl p-10 text-center">
              <Crown className="w-10 h-10 text-primary/40 mx-auto mb-3" />
              <p className="text-foreground font-semibold mb-2">No Property Ganj listings yet</p>
              <p className="text-sm text-muted-foreground mb-1">
                Our team is curating premium properties for this section.
              </p>
              <p className="text-xs text-muted-foreground">
                Admin can add listings from the <Link href="/admin" className="text-primary font-semibold hover:underline">dashboard</Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: Listed by Agents */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-background via-blue-50/30 to-background py-8 max-md:py-6 md:py-14 border-t border-border/30">
        <div className="w-full">
          <SectionHeader
            icon={<Users className="w-5 h-5 text-blue-600" />}
            title="Listed by Agents"
            subtitle="Verified agent-listed properties"
            href="/search?ownerType=agent"
            gradient="bg-blue-100"
          />
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-0 snap-x snap-mandatory">
            {agentFeed.length === 0 && <div className="min-w-full">{renderEmptyState("agent listings")}</div>}
            {agentFeed.map((property, index) => renderPropertyCard(property, index))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: Listed by Owner */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-background via-emerald-50/20 to-background py-8 max-md:py-6 md:py-14 border-t border-border/30">
        <div className="w-full">
          <SectionHeader
            icon={<Building2 className="w-5 h-5 text-emerald-600" />}
            title="Listed by Owner"
            subtitle="Direct owner properties — zero brokerage"
            href="/search?ownerType=owner"
            gradient="bg-emerald-100"
          />
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-0 snap-x snap-mandatory">
            {ownerFeed.length === 0 && <div className="min-w-full">{renderEmptyState("owner listings")}</div>}
            {ownerFeed.map((property, index) => renderPropertyCard(property, index))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Discover Properties — Themed Gradient Cards */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 max-md:py-6 md:py-14">
        <div className="w-full">
          <div className="mb-5 md:mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Explore by category</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">Discover Properties in {cityName}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[
              { title: "10,000+ Properties", subtitle: "Browse all listings", icon: "🏠", bgClass: "bg-[#181a1f] border border-border/40", textClass: "text-white", iconColor: "text-white/20", href: `/search?q=${cityName}` },
              { title: "Share Your Story", subtitle: "#MeriPropertyMeraGanj", icon: "✨", bgClass: "bg-[#d1b18a] border border-[#bd9b74]", textClass: "text-neutral-900", iconColor: "text-black/10", href: "/about" },
              { title: "Handpicked Projects", subtitle: "Curated for you", icon: "⭐", bgClass: "bg-[#2d3633] border border-[#242c2a]", textClass: "text-white", iconColor: "text-white/20", href: "/search?purpose=sale" },
              { title: "Owner Properties", subtitle: "Zero brokerage", icon: "🔑", bgClass: "bg-[#f4f2ef] border border-[#e5e0d8]", textClass: "text-neutral-900", iconColor: "text-black/5", href: "/search?ownerType=owner" },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className={`group relative overflow-hidden rounded-[22px] ${card.bgClass} p-5 md:p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`}
              >
                <div className={`absolute -right-4 -top-4 text-5xl ${card.iconColor} transition-transform duration-500 group-hover:scale-125`}>
                  {card.icon}
                </div>
                <p className="text-3xl mb-3">{card.icon}</p>
                <p className={`${card.textClass} font-bold text-sm md:text-base leading-tight`}>{card.title}</p>
                <p className={`mt-1 ${card.textClass === 'text-white' ? 'text-white/70' : 'text-neutral-600'} text-xs md:text-sm`}>{card.subtitle}</p>
                <div className={`mt-3 inline-flex items-center gap-1 text-[11px] font-semibold ${card.textClass === 'text-white' ? 'text-white/90' : 'text-neutral-800'} uppercase tracking-wider`}>
                  Explore <ArrowUpRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Popular Localities — Image Background Cards */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f5] py-8 max-md:py-6 md:py-14 border-t border-border/30">
        <div className="w-full">
          <div className="mb-5 md:mb-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Top neighbourhoods</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">Popular Localities in {cityName}</h2>
            </div>
            <Link href={`/search?q=${cityName}`} className="text-primary text-sm font-semibold hover:underline hidden md:block">View all →</Link>
          </div>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" data-locality-scroll>
              {localities.map((locality) => (
                <Link
                  key={locality.id}
                  href={`/search?q=${locality.name},${cityName}`}
                  className="group relative min-w-[300px] snap-start flex-shrink-0 overflow-hidden rounded-[22px] border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image header */}
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-black text-white drop-shadow">{locality.name}</h3>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2 py-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-white text-xs font-bold">{locality.rating}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm font-semibold text-foreground">{locality.priceRange}</p>
                    <p className="text-xs text-muted-foreground mt-1">{locality.reviews} reviews</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                        <MapPin className="h-3 w-3" />
                        {locality.properties} Properties
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('[data-locality-scroll]');
                if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
              }}
              className="hidden md:flex absolute right-0 md:-right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white border border-border shadow-lg hover:shadow-xl z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Trusted Agents — Premium Cards */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 max-md:py-6 md:py-14 border-t border-border/30">
        <div className="w-full">
          <div className="flex items-end justify-between mb-5 md:mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Verified professionals</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">Ganj Trusted Agents in {cityName}</h2>
            </div>
            <Link href="/search?ownerType=agent" className="text-primary font-semibold hover:underline text-sm hidden md:block">
              See all →
            </Link>
          </div>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" data-agent-scroll>
              {displayAgents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agent/${agent.id}`}
                  className="group min-w-[300px] snap-start flex-shrink-0 overflow-hidden rounded-[22px] border border-border bg-white p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img src={agent.image || "/placeholder.svg"} alt={agent.name} loading="lazy" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs shadow-sm ring-2 ring-white">
                        ✓
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-base truncate">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{agent.company}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#faf8f5] p-3 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Since</p>
                      <p className="font-bold text-foreground text-sm">{agent.since}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Buyers</p>
                      <p className="font-bold text-foreground text-sm">{agent.buyers}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="flex-1 rounded-xl bg-primary/5 p-2.5">
                      <p className="font-black text-primary text-xl">{agent.propertiesSale}</p>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">For Sale</p>
                    </div>
                    {agent.propertiesRent > 0 && (
                      <div className="flex-1 rounded-xl bg-sky-50 p-2.5">
                        <p className="font-black text-sky-600 text-xl">{agent.propertiesRent}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">For Rent</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('[data-agent-scroll]');
                if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
              }}
              className="hidden md:flex absolute right-0 md:-right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white border border-border shadow-lg z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Become an Agent CTA */}
          <div className="mt-10 max-md:mt-8 overflow-hidden rounded-[26px] bg-gradient-to-r from-[#1f2a2e] to-[#2d3c42] p-6 max-md:p-5 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 max-md:gap-4 shadow-2xl">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50 mb-2">Join our network</p>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Are you a Real Estate Professional?</h3>
              <p className="text-white/65 text-sm md:text-base max-w-2xl">Get access to verified leads, premium listings, and an exclusive agent profile on PropertyGanj.</p>
            </div>
            <Link
               href={currentUser ? '/agent/register' : '/auth'}
               className="bg-[#eb6239] text-white font-bold px-8 py-3.5 rounded-full whitespace-nowrap hover:bg-[#d85a35] transition shadow-lg shrink-0 inline-block text-center"
            >
              Apply as Agent
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Real Estate Guide — Premium Card Layout */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f5] py-8 max-md:py-6 md:py-14 border-t border-border/30">
        <div className="w-full">
          <div className="mb-5 md:mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Knowledge centre</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">Your Real Estate Guide</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Insights Card */}
            <div className="rounded-[26px] border border-border bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Property Ganj Insights</h3>
              </div>
              <div className="space-y-1">
                {[
                  { title: "Understanding Circle Rates", icon: "📊" },
                  { title: "Vastu Shastra for a Happy Home", icon: "🏛️" },
                  { title: "Stamp Duty: How is it Calculated?", icon: "📝" },
                  { title: `${cityName}'s Metro: A Homebuyer's Guide`, icon: "🚇" },
                  { title: "LDA vs. RERA: What You Need to Know", icon: "⚖️" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={`/blog/${i + 1}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#faf8f5] group"
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{item.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
                Read all articles <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Loan & Finance Card */}
            <div className="rounded-[26px] border border-border bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Landmark className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Loan & Finance</h3>
              </div>
              <div className="space-y-1">
                {[
                  { title: "Home Loan Eligibility Check", icon: "✅" },
                  { title: "Interest Rates & EMI Guide", icon: "💰" },
                  { title: `Top Banks for Loans in ${cityName}`, icon: "🏦" },
                  { title: "Documents Checklist for Buyers", icon: "📋" },
                  { title: "Pre-EMI vs Full EMI", icon: "📖" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={`/blog/${i + 1}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-emerald-50/50 group"
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-sm text-foreground font-medium group-hover:text-emerald-600 transition-colors">{item.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <Link href="/loan-finance" className="mt-4 inline-flex items-center gap-1 text-emerald-600 text-sm font-semibold hover:underline">
                Explore finance options <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
