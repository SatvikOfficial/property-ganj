"use client"

import Image from "next/image"
import { useCity } from "@/components/CityContext"

type BuilderRow = {
  id: string
  name: string
  logoSrc: string
}

const builders: BuilderRow[] = [
  { id: "eldeco", name: "Eldeco Group", logoSrc: "/developers/eldeco-group.webp" },
  { id: "shalimar", name: "Shalimar Corp", logoSrc: "/developers/shalimar-logo.png" },
  { id: "omaxe", name: "Omaxe Ltd", logoSrc: "/developers/Omaxe-logo.png" },
  { id: "rishita", name: "Rishita Developers", logoSrc: "/developers/rishita.png" },
  { id: "migsun", name: "Migsun Group", logoSrc: "/developers/migsun.png" },
]

export default function BuilderShowcase() {
  const { cityConfig } = useCity()

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2.5 px-0.5 text-center">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs md:text-sm">
          Top Developers
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        {builders.map((b) => (
          <div
            key={b.id}
            className="flex h-[44px] items-center justify-center rounded-2xl border border-white/16 bg-white/95 px-4 py-2 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-lg sm:h-[46px]"
          >
            <div className="relative h-full w-full max-w-[140px]">
              <Image
                src={b.logoSrc}
                alt={`${b.name} logo`}
                fill
                sizes="140px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-[10px] leading-relaxed text-white/55 sm:text-[11px]">
        Trusted developers in {cityConfig.name}
      </p>
    </div>
  )
}
