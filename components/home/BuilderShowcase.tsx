"use client"

import Image from "next/image"
import { useCity } from "@/components/CityContext"

type BuilderRow = {
  id: string
  name: string
  logoSrc: string
}

const builders: BuilderRow[] = [
  { id: "eldeco", name: "Eldeco Group", logoSrc: "/developers/eldeco_cropped.png" },
  { id: "shalimar", name: "Shalimar Corp", logoSrc: "/developers/shalimar_cropped.png" },
  { id: "omaxe", name: "Omaxe Ltd", logoSrc: "/developers/omaxe_cropped.png" },
  { id: "rishita", name: "Rishita Developers", logoSrc: "/developers/rishita_new.jpg" },
  { id: "migsun", name: "Migsun Group", logoSrc: "/developers/migsun_cropped.png" },
]

export default function BuilderShowcase() {
  const { cityConfig } = useCity()

  return (
    <div className="flex w-full flex-col">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="mb-3 px-1 flex items-center justify-between gap-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
            Top Developers
          </h2>
          <p className="truncate text-[9px] text-white/50">
            Trusted in {cityConfig.name}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {builders.map((b) => (
            <div
              key={b.id}
              className="relative flex h-[74px] items-center justify-center overflow-hidden rounded-[22px] bg-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)]"
            >
              <Image
                src={b.logoSrc}
                alt={`${b.name} logo`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden w-full flex-col md:flex">
        <div className="mb-1.5 px-0.5 text-center">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 sm:text-xs md:text-sm">
            Top Developers
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          {builders.map((b) => (
            <div
              key={b.id}
              className="relative flex h-[54px] items-center justify-center overflow-hidden rounded-[18px] bg-white shadow-[0_10px_25px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Image
                src={b.logoSrc}
                alt={`${b.name} logo`}
                fill
                sizes="100vw"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>

        <p className="mt-1.5 text-center text-[10px] leading-relaxed text-white/50 sm:text-[11px]">
          Trusted developers in {cityConfig.name}
        </p>
      </div>
    </div>
  )
}
