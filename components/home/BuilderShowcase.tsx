"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, MapPin, ExternalLink } from "lucide-react"

type BuilderProperty = {
  id: string
  title: string
  location: string
  price: string
  image: string
}

type BuilderRow = {
  id: string
  name: string
  tagline: string
  logoSrc: string
  cardClassName: string
  properties: BuilderProperty[]
}

const builders: BuilderRow[] = [
  {
    id: "eldeco",
    name: "Eldeco Group",
    tagline: "Trust. Delivery. Quality.",
    logoSrc: "https://eldecogroup.com/assests/images/logo.png",
    cardClassName: "bg-[#14532d] shadow-[0_12px_28px_rgba(0,0,0,0.22)]",
    properties: [
      {
        id: "p1",
        title: "Eldeco Latitude 27",
        location: "IIM Road, Lucknow",
        price: "₹85 Lac - 1.25 Cr",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "p2",
        title: "Eldeco Trinity",
        location: "Gomti Nagar Extension, Lucknow",
        price: "₹1.5 Cr - 2.8 Cr",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    id: "shalimar",
    name: "Shalimar Corp",
    tagline: "Built on Trust.",
    logoSrc: "https://www.shalimarcorp.com/images/head_logo_1.png",
    cardClassName: "bg-[#1a2238] shadow-[0_12px_28px_rgba(0,0,0,0.22)]",
    properties: [
      {
        id: "s1",
        title: "Shalimar One World",
        location: "Gomti Nagar Extension, Lucknow",
        price: "₹1.1 Cr - 3.5 Cr",
        image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    id: "omaxe",
    name: "Omaxe Ltd",
    tagline: "Turning Dreams into Reality.",
    logoSrc: "https://www.omaxe.com/assets/front/images/omaxe-logo.webp",
    cardClassName: "bg-[#c8102e] shadow-[0_12px_28px_rgba(0,0,0,0.22)]",
    properties: [
      {
        id: "o1",
        title: "Omaxe Hazratganj",
        location: "Sultanpur Road, Lucknow",
        price: "₹45 Lac onwards",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    id: "rishita",
    name: "Rishita Developers",
    tagline: "Experience Luxury Like Never Before.",
    logoSrc: "https://www.rishita.in/img/logo.png",
    cardClassName: "bg-[#1d4ed8] shadow-[0_12px_28px_rgba(0,0,0,0.22)]",
    properties: [
      {
        id: "r1",
        title: "Rishita Mulberry Heights",
        location: "Sushant Golf City, Lucknow",
        price: "₹95 Lac - 1.8 Cr",
        image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  {
    id: "migsun",
    name: "Migsun Group",
    tagline: "Building a Better Future.",
    logoSrc: "https://migsun.in/assets/images/logo.png",
    cardClassName: "bg-[#ea580c] shadow-[0_12px_28px_rgba(0,0,0,0.22)]",
    properties: [
      {
        id: "m1",
        title: "Migsun Janpath",
        location: "Shaheed Path, Lucknow",
        price: "₹35 Lac onwards",
        image: "https://images.unsplash.com/photo-1593006526978-9585970c3260?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
]

export default function BuilderShowcase() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mb-3 flex items-baseline justify-between gap-3 px-0.5">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs md:text-sm">
          Top Developers
        </h2>
        <span className="text-[9px] font-light uppercase tracking-[0.28em] text-white/75 sm:text-[10px] md:text-xs">
          Lucknow Showcase
        </span>
      </div>

      <ul className="flex flex-col gap-2.5 sm:gap-3">
        {builders.map((b) => {
          const isExpanded = expandedId === b.id
          return (
            <li key={b.id} className="overflow-hidden rounded-[22px] sm:rounded-3xl transition-all duration-300">
              <button
                onClick={() => toggleExpand(b.id)}
                className={`flex w-full min-h-[4.25rem] items-center gap-3 px-3 py-2.5 sm:gap-3.5 sm:px-4 sm:py-3 text-left transition-all duration-300 ${b.cardClassName}`}
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm sm:h-12 sm:w-12 sm:p-1.5">
                  <div className="relative h-full w-full">
                    <Image
                      src={b.logoSrc}
                      alt={`${b.name} logo`}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight text-white sm:text-base">{b.name}</p>
                  <p className="mt-0.5 text-[11px] font-normal leading-snug text-white/90 sm:text-xs">
                    {b.tagline}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-white/90 transition-transform duration-300 sm:h-[18px] sm:w-[18px] ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-2 p-1 sm:grid-cols-2">
                    {b.properties.map((prop) => (
                      <div
                        key={prop.id}
                        className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-2 transition-all hover:bg-white/20 border border-white/10"
                      >
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                            <Image
                              src={prop.image}
                              alt={prop.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-[13px] font-bold text-white sm:text-sm">
                              {prop.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-white/80 sm:text-xs">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{prop.location}</span>
                            </div>
                            <p className="mt-1 text-[11px] font-semibold text-white sm:text-[12px]">
                              {prop.price}
                            </p>
                          </div>
                          <div className="flex items-center justify-center p-1">
                            <ExternalLink className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-center text-[10px] leading-relaxed text-white/55 sm:text-[11px] md:mt-3.5">
        Showing most trusted developers in Lucknow
      </p>
    </div>
  )
}
