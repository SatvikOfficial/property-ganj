'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { type CityId, type CityConfig, DEFAULT_CITY, getCityConfig, SUPPORTED_CITIES } from '@/data/cityConfig';

type CityContextValue = {
  selectedCity: CityId;
  cityConfig: CityConfig;
  allCities: CityConfig[];
  setCity: (city: CityId) => void;
};

const CityContext = createContext<CityContextValue | null>(null);

const STORAGE_KEY = 'pg:selected-city';

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<CityId>(DEFAULT_CITY);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_CITIES.some((c) => c.id === stored)) {
        setSelectedCity(stored as CityId);
      }
    } catch {
      // SSR or localStorage unavailable
    }
  }, []);

  const setCity = useCallback((city: CityId) => {
    setSelectedCity(city);
    try {
      localStorage.setItem(STORAGE_KEY, city);
    } catch {
      // noop
    }
  }, []);

  const cityConfig = getCityConfig(selectedCity);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        cityConfig,
        allCities: SUPPORTED_CITIES,
        setCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) {
    // Fallback for components rendered outside provider
    return {
      selectedCity: DEFAULT_CITY,
      cityConfig: getCityConfig(DEFAULT_CITY),
      allCities: SUPPORTED_CITIES,
      setCity: () => {},
    };
  }
  return ctx;
}
