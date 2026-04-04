"use client"

import { useCity } from "@/components/CityContext"

export default function BuilderShowcase() {
  const { cityConfig } = useCity()

  return (
    <div className="flex w-full flex-col">
      {/* ─── MOBILE VIEW ─── compact horizontal scroll */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
            Top Developers
          </span>
          <div className="ml-3 h-px flex-1 bg-white/20" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
          {/* Eldeco mobile */}
          <div className="developer-card min-w-[130px] snap-start flex-shrink-0 rounded-xl bg-white p-3 flex items-center justify-center h-[52px] shadow-md">
            <div className="flex items-center">
              <span className="text-[#006838] font-black text-xl italic tracking-tighter">ELDECO</span>
              <span className="text-[#006838] text-[7px] font-bold ml-0.5 self-end mb-1">Group</span>
            </div>
          </div>

          {/* Shalimar mobile */}
          <div className="developer-card min-w-[130px] snap-start flex-shrink-0 rounded-xl bg-white p-3 flex flex-col items-center justify-center h-[52px] shadow-md">
            <svg className="h-4 w-auto mb-0.5" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 25 Q 50 5 95 25" fill="none" stroke="#B8860B" strokeWidth="1.5" />
              <rect fill="#B8860B" x="48.75" y="6" width="2.5" height="15" />
              <rect fill="#B8860B" x="46" y="13" width="2" height="8" />
              <rect fill="#B8860B" x="44" y="16" width="2" height="5" />
            </svg>
            <span className="text-[#B8860B] text-[9px] font-bold tracking-[0.3em] uppercase" style={{ fontFamily: "serif" }}>SHALIMAR</span>
          </div>

          {/* Omaxe mobile */}
          <div className="developer-card min-w-[130px] snap-start flex-shrink-0 rounded-xl bg-white p-3 flex items-center justify-center h-[52px] shadow-md">
            <div className="flex items-center gap-1.5">
              <div className="grid grid-cols-2 gap-[2px] w-5 h-5">
                <div className="bg-red-600 border border-red-600" />
                <div className="bg-white border border-red-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-600" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                </div>
                <div className="bg-red-600 border border-red-600" />
                <div className="bg-red-600 border border-red-600" />
              </div>
              <span className="text-[#0054A6] font-black text-lg tracking-tighter">OMAXE</span>
            </div>
          </div>

          {/* Rishita mobile */}
          <div className="developer-card min-w-[130px] snap-start flex-shrink-0 rounded-xl bg-white p-3 flex items-center justify-center h-[52px] shadow-md">
            <div className="relative flex items-center scale-[1.1]">
              <div className="absolute top-0 left-[18px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#FFD700] rotate-180" />
              <span className="text-zinc-800 font-black text-xl tracking-tighter">rishita</span>
              <div className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-[#FFD700]" />
            </div>
          </div>

          {/* Migsun mobile */}
          <div className="developer-card min-w-[130px] snap-start flex-shrink-0 rounded-xl bg-white p-3 flex flex-col items-center justify-center h-[52px] shadow-md">
            <div className="relative w-10 h-4 mb-0.5">
              <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 40 Q 50 10 90 20 L 85 25 Q 50 20 20 45 Z" fill="url(#wingGradMobile)" />
                <path d="M20 35 Q 55 15 85 30 L 80 34 Q 55 25 30 40 Z" fill="url(#wingGradMobile)" opacity="0.8" />
                <defs>
                  <linearGradient id="wingGradMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#FF8C00", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-black font-black text-sm tracking-tighter">MIGSUN</span>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP VIEW ─── vertical stack with hover animations */}
      <div className="hidden md:flex flex-col w-full space-y-2">
        <div className="flex items-center justify-between mb-1 px-2">
          <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
            Top Developers
          </span>
          <div className="h-px flex-1 bg-white/20 ml-4" />
        </div>

        {/* Eldeco */}
        <div className="developer-card bg-white rounded-xl p-4 flex items-center justify-center h-[60px] shadow-lg border border-transparent">
          <div className="flex items-center">
            <span className="text-[#006838] font-black text-3xl italic tracking-tighter">ELDECO</span>
            <span className="text-[#006838] text-[10px] font-bold ml-1 self-end mb-1.5">Group</span>
          </div>
        </div>

        {/* Shalimar */}
        <div className="developer-card bg-white rounded-xl p-4 flex flex-col items-center justify-center h-[60px] shadow-lg border border-transparent">
          <svg className="h-5 w-auto mb-0.5" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 25 Q 50 5 95 25" fill="none" stroke="#B8860B" strokeWidth="1.5" />
            <rect fill="#B8860B" x="48.75" y="6" width="2.5" height="15" />
            <rect fill="#B8860B" x="46" y="13" width="2" height="8" />
            <rect fill="#B8860B" x="44" y="16" width="2" height="5" />
          </svg>
          <span className="text-[#B8860B] text-[11px] font-bold tracking-[0.4em] uppercase" style={{ fontFamily: "serif" }}>SHALIMAR</span>
        </div>

        {/* Omaxe */}
        <div className="developer-card bg-white rounded-xl p-4 flex items-center justify-center h-[60px] shadow-lg border border-transparent">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-[3px] w-7 h-7">
              <div className="bg-red-600 border border-red-600" />
              <div className="bg-white border border-red-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              </div>
              <div className="bg-red-600 border border-red-600" />
              <div className="bg-red-600 border border-red-600" />
            </div>
            <span className="text-[#0054A6] font-black text-3xl tracking-tighter">OMAXE</span>
          </div>
        </div>

        {/* Rishita */}
        <div className="developer-card bg-white rounded-xl p-4 flex items-center justify-center h-[60px] shadow-lg border border-transparent">
          <div className="relative flex items-center scale-125">
            <div className="absolute top-0 left-[26px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#FFD700] rotate-180" />
            <span className="text-zinc-800 font-black text-2xl tracking-tighter">rishita</span>
            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FFD700]" />
          </div>
        </div>

        {/* Migsun */}
        <div className="developer-card bg-white rounded-xl p-4 flex flex-col items-center justify-center h-[60px] shadow-lg border border-transparent">
          <div className="relative w-14 h-6 mb-0.5">
            <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 40 Q 50 10 90 20 L 85 25 Q 50 20 20 45 Z" fill="url(#wingGradLarge)" />
              <path d="M20 35 Q 55 15 85 30 L 80 34 Q 55 25 30 40 Z" fill="url(#wingGradLarge)" opacity="0.8" />
              <defs>
                <linearGradient id="wingGradLarge" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#FF8C00", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-black font-black text-lg tracking-tighter">MIGSUN</span>
        </div>

        <p className="text-white/50 text-[10px] text-center pt-1 font-medium">
          Trusted developers in {cityConfig.name}
        </p>
      </div>
    </div>
  )
}
