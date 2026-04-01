import { POPULAR_LUCKNOW_LOCALITIES, type PopularLucknowLocality } from './lucknowLocalities';
import { POPULAR_NOIDA_LOCALITIES } from './noidaLocalities';
import { POPULAR_GHAZIABAD_LOCALITIES } from './ghaziabadLocalities';
import { POPULAR_GREATER_NOIDA_LOCALITIES } from './greaterNoidaLocalities';

export type CityId = 'lucknow' | 'noida' | 'ghaziabad' | 'greater-noida';

export type CityConfig = {
  id: CityId;
  name: string;
  shortName: string;
  state: string;
  centroid: { lat: number; lon: number };
  boundingBox: string; // Geoapify format: rect:lon1,lat1,lon2,lat2
  localities: PopularLucknowLocality[];
};

export const SUPPORTED_CITIES: CityConfig[] = [
  {
    id: 'lucknow',
    name: 'Lucknow',
    shortName: 'LKO',
    state: 'Uttar Pradesh',
    centroid: { lat: 26.8467, lon: 80.9462 },
    boundingBox: 'rect:80.7506,26.7002,81.1104,27.1502',
    localities: POPULAR_LUCKNOW_LOCALITIES,
  },
  {
    id: 'noida',
    name: 'Noida',
    shortName: 'NOI',
    state: 'Uttar Pradesh',
    centroid: { lat: 28.5355, lon: 77.3910 },
    boundingBox: 'rect:77.2800,28.4500,77.4500,28.6500',
    localities: POPULAR_NOIDA_LOCALITIES,
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad',
    shortName: 'GZB',
    state: 'Uttar Pradesh',
    centroid: { lat: 28.6692, lon: 77.4538 },
    boundingBox: 'rect:77.2500,28.5800,77.5500,28.7800',
    localities: POPULAR_GHAZIABAD_LOCALITIES,
  },
  {
    id: 'greater-noida',
    name: 'Greater Noida',
    shortName: 'GN',
    state: 'Uttar Pradesh',
    centroid: { lat: 28.4744, lon: 77.5040 },
    boundingBox: 'rect:77.3800,28.3800,77.6000,28.5700',
    localities: POPULAR_GREATER_NOIDA_LOCALITIES,
  },
];

export const DEFAULT_CITY: CityId = 'lucknow';

export function getCityConfig(cityId: CityId): CityConfig {
  return SUPPORTED_CITIES.find((c) => c.id === cityId) || SUPPORTED_CITIES[0];
}

export function getCityByName(name: string): CityConfig | undefined {
  const normalized = name.toLowerCase().trim();
  return SUPPORTED_CITIES.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      c.shortName.toLowerCase() === normalized ||
      c.id === normalized
  );
}
