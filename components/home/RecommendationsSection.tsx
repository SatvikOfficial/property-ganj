"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowUpRight } from "lucide-react"
import { getRecentlyViewedIds, subscribeToRecentlyViewed } from "@/lib/recently-viewed"
import { getRecommendations, RecommendedProperty } from "@/lib/recommendations"
import LikeButton from "@/components/LikeButton"

const FALLBACK_IMAGES = [
  "/modern-apartment.jpg",
  "/2bhk-flat.jpg",
  "/luxury-apartment.jpg",
  "/residential-property.jpg",
]

function formatPrice(value?: number) {
  if (!value) return "₹ —"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function fallbackImg(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i)
  return FALLBACK_IMAGES[h % FALLBACK_IMAGES.length]
}

export default function RecommendationsSection() {
  const [cards, setCards] = useState<RecommendedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const recommended = await getRecommendations(5)
        setCards(recommended)
      } catch (e) {
        console.error('[Recommendations] Error loading:', e)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    load()

    const unsub = subscribeToRecentlyViewed(() => {
      setRefreshTrigger(prev => prev + 1)
    })
    return unsub
  }, [refreshTrigger])

  if (loading) return (
    <section className="py-10 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
    </section>
  )

  // Hide the section if no recommendations available
  if (cards.length === 0) return null

  return (
    <section id="recommendations" className="border-t border-border/30 bg-gradient-to-br from-background via-orange-50/20 to-background py-8 max-md:py-6 md:py-14">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between max-md:mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-2.5 shadow-sm">
              <Sparkles className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Recommended for You</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Properties you might like based on your interest
              </p>
            </div>
          </div>
        </div>

        {/* Cards row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {cards.map((card) => {
            const isRent = card.for_rent === true;
            const priceStr = formatPrice(isRent ? card.rent : card.price);
            const locStr = [card.locality, card.city].filter(Boolean).join(", ") || "Lucknow";

            return (
              <Link
                key={card.id}
                href={`/property/${card.id}`}
                className="group min-w-[260px] max-w-[300px] flex-shrink-0 snap-start overflow-hidden rounded-[22px] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-muted">
                  <LikeButton
                    propertyId={card.id}
                    initialLiked={false}
                    className="absolute right-3 top-3 z-20"
                  />
                  <Image
                    src={card.provider || fallbackImg(card.id)}
                    alt={card.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      isRent
                        ? "bg-sky-500/90 text-white"
                        : "bg-[#eb6239]/90 text-white"
                    }`}>
                      {isRent ? "For Rent" : "For Sale"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="line-clamp-1 text-sm font-semibold text-foreground">{card.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{locStr}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-black text-[#eb6239]">{priceStr}</p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
