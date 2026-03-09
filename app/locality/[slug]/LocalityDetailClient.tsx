'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, TrendingUp, Home, Building, User, ArrowRight, Check, X } from 'lucide-react';
import PropertyCard from '@/components/property-card';
import { PopularLucknowLocality } from '@/data/lucknowLocalities';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocalityDetailClientProps {
    locality: PopularLucknowLocality & {
        realStats?: {
            count: number;
        };
        image?: string;
        slug?: string;
    };
    properties: any[];
    projects: any[];
    ownerProperties: any[];
    nearbyLocalities: any[];
    allLocalities: {
        label: string;
        slug: string;
        insights?: any;
    }[];
}

export default function LocalityDetailClient({
    locality,
    properties,
    projects,
    ownerProperties,
    nearbyLocalities,
    allLocalities,
}: LocalityDetailClientProps) {
    const [activeTab, setActiveTab] = useState('properties');
    const [compareLocalitySlug, setCompareLocalitySlug] = useState<string>("");

    const compareLocality = allLocalities.find(l => l.slug === compareLocalitySlug);

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        }
        return `₹${(price / 100000).toFixed(2)} L`;
    };

    const renderComparisonRow = (label: string, val1: any, val2: any, highlightBetter: 'higher' | 'lower' | 'none' = 'none') => {
        let color1 = "text-foreground";
        let color2 = "text-foreground";

        if (highlightBetter !== 'none' && val1 !== val2 && val1 !== undefined && val2 !== undefined) {
            if (highlightBetter === 'higher') {
                if (val1 > val2) color1 = "text-green-600 font-bold";
                else color2 = "text-green-600 font-bold";
            } else {
                if (val1 < val2) color1 = "text-green-600 font-bold";
                else color2 = "text-green-600 font-bold";
            }
        }

        return (
            <div className="grid grid-cols-3 py-3 border-b border-border last:border-0">
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
                <div className={`text-sm ${color1}`}>{val1 ?? '—'}</div>
                <div className={`text-sm ${color2}`}>{val2 ?? '—'}</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px]">
                <img
                    src={locality.image || '/kanpur-road-locality.jpg'}
                    alt={locality.label}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-white/80 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{locality.area || 'Lucknow'}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                                    {locality.label}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-white">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-amber-500 p-1 rounded">
                                            <Star className="w-4 h-4 fill-white text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{locality.insights?.safetyRating || 4.5}</p>
                                            <p className="text-xs text-white/70">Safety Rating</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-white/20" />
                                    <div>
                                        <p className="font-bold text-lg">
                                            ₹{locality.insights?.averagePricePerSqft ? (locality.insights.averagePricePerSqft * 0.5).toFixed(0) : '3900'} - ₹{locality.insights?.averagePricePerSqft ? (locality.insights.averagePricePerSqft * 1.5).toFixed(0) : '11700'}
                                        </p>
                                        <p className="text-xs text-white/70">Price per sqft</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/20" />
                                    <div>
                                        <p className="font-bold text-lg">{locality.realStats?.count || 0}+</p>
                                        <p className="text-xs text-white/70">Properties Listed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                                            Compare Locality
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">Compare Localities</DialogTitle>
                                        </DialogHeader>

                                        <div className="grid grid-cols-3 gap-4 mt-6 border-b border-border pb-4 mb-4">
                                            <div className="font-bold text-muted-foreground">Metric</div>
                                            <div className="font-bold text-xl text-primary">{locality.label}</div>
                                            <div>
                                                <Select onValueChange={setCompareLocalitySlug}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select locality" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allLocalities
                                                            .filter(l => l.slug !== locality.slug) // Exclude current
                                                            .sort((a, b) => a.label.localeCompare(b.label))
                                                            .map(l => (
                                                                <SelectItem key={l.slug} value={l.slug}>{l.label}</SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {compareLocality ? (
                                            <div className="space-y-1">
                                                {renderComparisonRow("Safety Rating", locality.insights?.safetyRating, compareLocality.insights?.safetyRating, 'higher')}
                                                {renderComparisonRow("Avg Price/sqft", `₹${locality.insights?.averagePricePerSqft}`, `₹${compareLocality.insights?.averagePricePerSqft}`, 'lower')}
                                                {renderComparisonRow("Ranking", `#${locality.insights?.ranking}`, `#${compareLocality.insights?.ranking}`, 'lower')}

                                                <div className="grid grid-cols-3 py-3 border-b border-border">
                                                    <div className="text-sm text-muted-foreground font-medium">Pros</div>
                                                    <div className="text-sm">
                                                        <ul className="list-disc list-inside text-xs space-y-1">
                                                            {locality.insights?.pros?.map((p, i) => <li key={i}>{p}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div className="text-sm">
                                                        <ul className="list-disc list-inside text-xs space-y-1">
                                                            {compareLocality.insights?.pros?.map((p: any, i: number) => <li key={i}>{p}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 py-3 border-b border-border">
                                                    <div className="text-sm text-muted-foreground font-medium">Cons</div>
                                                    <div className="text-sm">
                                                        <ul className="list-disc list-inside text-xs space-y-1 text-red-600/80">
                                                            {locality.insights?.cons?.map((p, i) => <li key={i}>{p}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div className="text-sm">
                                                        <ul className="list-disc list-inside text-xs space-y-1 text-red-600/80">
                                                            {compareLocality.insights?.cons?.map((p: any, i: number) => <li key={i}>{p}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                Select a locality to compare with {locality.label}
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                <Button className="bg-primary text-white hover:bg-primary/90 font-semibold">
                                    View Map
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* About Section */}
                        <section className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                            <h2 className="text-2xl font-bold mb-4">About {locality.label}</h2>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                {locality.insights?.pros?.[0]
                                    ? `${locality.label} is known for ${locality.insights.pros.join(', ').toLowerCase()}. It offers a blend of residential and commercial spaces, making it a prime choice for homebuyers and investors.`
                                    : `${locality.label} is one of the most sought-after localities in Lucknow, offering excellent connectivity and modern amenities.`
                                }
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Pros
                                    </h3>
                                    <ul className="space-y-2">
                                        {locality.insights?.pros?.map((pro, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                {pro}
                                            </li>
                                        )) || <li className="text-sm text-muted-foreground">Excellent connectivity</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <span className="text-red-500">!</span> Cons
                                    </h3>
                                    <ul className="space-y-2">
                                        {locality.insights?.cons?.map((con, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                {con}
                                            </li>
                                        )) || <li className="text-sm text-muted-foreground">Traffic during peak hours</li>}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Listings Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Properties in {locality.label}</h2>
                            </div>

                            <Tabs defaultValue="properties" className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="w-full justify-start mb-6 bg-transparent p-0 border-b border-border rounded-none h-auto">
                                    <TabsTrigger
                                        value="properties"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                                    >
                                        All Properties ({properties.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="projects"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                                    >
                                        New Projects ({projects.length})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="owner"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-base"
                                    >
                                        Owner Properties ({ownerProperties.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="properties" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {properties.length > 0 ? (
                                            properties.map((property) => (
                                                <PropertyCard
                                                    key={property._id}
                                                    property={{
                                                        id: property._id,
                                                        title: property.title,
                                                        price: formatPrice(property.price),
                                                        location: `${property.location?.locality}, ${property.location?.city}`,
                                                        bhk: `${property.specs?.bedrooms || 2} BHK`,
                                                        sqft: property.specs?.carpetArea || property.specs?.builtUpArea,
                                                        image: property.media?.photos?.[0]?.url,
                                                        featured: false
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl">
                                                <p className="text-muted-foreground">No properties found in this locality.</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="projects" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <div key={project._id} className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all">
                                                    <div className="h-48 bg-muted relative">
                                                        <img src={project.coverImage || "/placeholder.svg"} alt={project.name} className="w-full h-full object-cover" />
                                                        <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded text-xs font-bold">New Launch</div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                                                        <p className="text-primary font-bold">₹{project.minPrice ? (project.minPrice / 100000).toFixed(1) + 'L' : 'Price on Request'}</p>
                                                        <p className="text-sm text-muted-foreground mt-2">{project.builderId}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl">
                                                <p className="text-muted-foreground">No new projects listed yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="owner" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {ownerProperties.length > 0 ? (
                                            ownerProperties.map((property) => (
                                                <PropertyCard
                                                    key={property._id}
                                                    property={{
                                                        id: property._id,
                                                        title: property.title,
                                                        price: formatPrice(property.price),
                                                        location: `${property.location?.locality}, ${property.location?.city}`,
                                                        bhk: `${property.specs?.bedrooms || 2} BHK`,
                                                        sqft: property.specs?.carpetArea || property.specs?.builtUpArea,
                                                        image: property.media?.photos?.[0]?.url,
                                                        featured: false
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl">
                                                <p className="text-muted-foreground">No owner properties listed yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Price Trends */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Price Trends
                            </h3>
                            <div className="space-y-4">
                                {locality.insights?.priceTrend?.map((trend, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{trend.year}</span>
                                        <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary/60 rounded-full"
                                                style={{ width: `${(trend.price / 10000) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-semibold">₹{trend.price}/sqft</span>
                                    </div>
                                )) || (
                                        <p className="text-sm text-muted-foreground">Price trend data not available.</p>
                                    )}
                            </div>
                        </div>

                        {/* Nearby Localities */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                            <h3 className="font-bold text-lg mb-4">Nearby Localities</h3>
                            <div className="space-y-3">
                                {nearbyLocalities.map((loc, i) => (
                                    <Link
                                        href={`/locality/${loc.slug}`}
                                        key={i}
                                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                                            <img src={loc.image} alt={loc.label} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate group-hover:text-primary transition-colors">{loc.label}</p>
                                            <p className="text-xs text-muted-foreground truncate">{loc.priceRange}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
