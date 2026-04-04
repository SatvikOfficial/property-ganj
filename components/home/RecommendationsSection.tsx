"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowUpRight, Brain, TrendingUp, MapPin } from "lucide-react"
import { getRecentlyViewed, subscribeToRecentlyViewed } from "@/lib/recently-viewed"
import { getRecommendations, RecommendedProperty } from "@/lib/recommendations"
import { createClient } from "@/utils/supabase/client"
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

function getMatchColor(score: number) {
  if (score >= 20) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Strong Match" }
  if (score >= 12) return { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", label: "Good Match" }
  if (score >= 6) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Relevant" }
  return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", label: "Suggested" }
}

export default function RecommendationsSection() {
  const [cards, setCards] = useState<RecommendedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null) // null = checking

  // Check auth status first
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  const loadRecommendations = useCallback(async () => {
    setLoading(true)
    try {
      const recommended = await getRecommendations(6)
      setCards(recommended)
    } catch (e) {
      console.error('[Recommendations] Error loading:', e)
      setCards([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Load recommendations when logged in, and subscribe to recently-viewed changes
  useEffect(() => {
    if (isLoggedIn !== true) return

    loadRecommendations()

    // Subscribe to recently-viewed updates (fires when user views or likes a property)
    const unsub = subscribeToRecentlyViewed(() => {
      // Debounce: wait a tick before reloading to avoid hammering
      setTimeout(() => {
        loadRecommendations()
      }, 300)
    })

    return unsub
  }, [isLoggedIn, loadRecommendations])

  // Don't render if not logged in or still checking auth
  if (isLoggedIn !== true) return null

  if (loading) return (
    <section className="py-10 text-center">
      <div className="flex items-center justify-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#eb6239] border-t-transparent"></div>
        <p className="text-sm text-muted-foreground animate-pulse">Analysing your preferences…</p>
      </div>
    </section>
  )

  // Even for logged-in users with no recommendations, hide the section
  if (cards.length === 0) return null

  return (
    <section id="recommendations" className="relative border-t border-border/30 py-8 max-md:py-6 md:py-14 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-background to-amber-50/30" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#eb6239]/5 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between max-md:mb-4 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="relative rounded-xl bg-gradient-to-br from-[#eb6239] to-[#d6522f] p-2.5 shadow-[0_8px_20px_-6px_rgba(235,98,57,0.4)]">
              <Brain className="h-5 w-5 text-white" />
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                Recommended for You
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-[#eb6239]" />
                Smart picks based on your browsing & interests
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
            const matchInfo = getMatchColor(card.matchScore || 0);

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
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Purpose badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      isRent
                        ? "bg-sky-500/90 text-white"
                        : "bg-[#eb6239]/90 text-white"
                    }`}>
                      {isRent ? "For Rent" : "For Sale"}
                    </span>
                  </div>

                  {/* Match score badge */}
                  {(card.matchScore || 0) > 0 && (
                    <div className={`absolute top-3 left-3 rounded-full ${matchInfo.bg} ${matchInfo.border} border px-2 py-0.5 text-[10px] font-bold ${matchInfo.text} flex items-center gap-1 backdrop-blur-sm`}>
                      <Sparkles className="h-2.5 w-2.5" />
                      {matchInfo.label}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="line-clamp-1 text-sm font-semibold text-foreground">{card.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {locStr}
                  </p>

                  {/* Match reasons */}
                  {card.matchReasons && card.matchReasons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {card.matchReasons.map((reason, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}

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
