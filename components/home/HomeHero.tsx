"use client"

import { useState } from "react"

import BuilderShowcase from "@/components/home/BuilderShowcase"
import DynamicGreeting from "@/components/dynamic-greeting"
import SearchBar from "@/components/search-bar"

const heroFilters = ["Buy", "Rent", "Plots", "Commercial"]

export default function HomeHero() {
  const [activeFilter, setActiveFilter] = useState("Buy")

  return (
    <section id="hero-section" className="relative z-20 bg-background pb-1 pt-0 md:pb-0 md:pt-1">
      <div className="w-full">
        <div className="relative rounded-[26px] border border-slate-200/80 shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:rounded-[32px]">
          {/* Background Wrapper with Overflow Hidden to keep video/overlays clipped */}
          <div className="absolute inset-0 overflow-hidden rounded-[32px] sm:rounded-[32px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/hero_brightener.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(5,16,32,0.84)_0%,rgba(8,26,49,0.72)_34%,rgba(12,25,44,0.42)_64%,rgba(16,35,36,0.22)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_84%_20%,rgba(235,98,57,0.18),transparent_26%)]" />
          </div>

          <div className="relative z-10 flex flex-col justify-center gap-2 px-4 py-3 sm:px-8 sm:py-2 lg:px-10 lg:py-1.5">
            <div className="flex w-full flex-col gap-3 max-md:gap-2 lg:flex-row lg:items-stretch lg:gap-7 xl:gap-8">
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 max-md:gap-2">
                <div className="max-w-3xl pg-mobile-hero-item" style={{ ['--pg-enter-delay' as string]: '0ms' }}>
                  <div className="mt-1 max-w-4xl [&_.text-foreground]:!text-white [&_h1]:!mb-0 [&_h1]:!text-white">
                    <DynamicGreeting />
                  </div>
                  <p
                    className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base pg-mobile-hero-item"
                    style={{ ['--pg-enter-delay' as string]: '80ms' }}
                  >
                    Explore homes, rentals, plots, and commercial inventory in one cleaner flow backed by smarter filters.
                  </p>
                </div>

                <div
                  className="pg-mobile-chip-row gap-2 md:flex md:flex-wrap md:overflow-visible md:pb-0 pg-mobile-hero-item"
                  style={{ ['--pg-enter-delay' as string]: '160ms' }}
                >
                  {heroFilters.map((filter) => {
                    const isActive = filter === activeFilter

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                          isActive
                            ? "bg-white text-slate-900 shadow-[0_12px_24px_rgba(255,255,255,0.16)]"
                            : "border border-white/16 bg-white/10 text-white/82 backdrop-blur hover:bg-white/16"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  })}
                </div>

                <div className="max-w-5xl pg-mobile-hero-item" style={{ ['--pg-enter-delay' as string]: '240ms' }}>
                  <SearchBar activeFilter={activeFilter} />
                </div>
              </div>

              <div
                className="w-full shrink-0 pg-mobile-hero-item lg:w-[min(100%,320px)] xl:w-[min(100%,360px)]"
                style={{ ['--pg-enter-delay' as string]: '320ms' }}
              >
                <BuilderShowcase />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
