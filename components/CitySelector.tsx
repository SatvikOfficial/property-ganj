'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Check } from 'lucide-react';
import { useCity } from '@/components/CityContext';
import type { CityId } from '@/data/cityConfig';

export default function CitySelector() {
  const { selectedCity, cityConfig, allCities, setCity } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground transition duration-200 hover:border-primary/30 hover:text-primary active:scale-[0.97]"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {cityConfig.name}
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[9999] mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
          <div className="border-b border-border/60 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Select City
            </p>
          </div>
          <div className="p-1.5">
            {allCities.map((city) => {
              const isActive = city.id === selectedCity;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    setCity(city.id as CityId);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition duration-200 ${
                    isActive
                      ? 'bg-primary/8 text-primary'
                      : 'text-foreground hover:bg-accent/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {city.shortName}
                    </div>
                    <div>
                      <p className="font-semibold">{city.name}</p>
                      <p className="text-[11px] text-muted-foreground">{city.state}</p>
                    </div>
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
