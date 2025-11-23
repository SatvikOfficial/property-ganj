// app/locality/[name]/page.tsx
import { notFound } from 'next/navigation';
import { POPULAR_LUCKNOW_LOCALITIES, PopularLucknowLocality } from '@/data/lucknowLocalities';
import LocalityClientPage from './LocalityClientPage';
import { IProperty } from '@/models/Property';

const getLocalityBySlug = (slug: string): PopularLucknowLocality | undefined => {
  return POPULAR_LUCKNOW_LOCALITIES.find(locality => {
    const localitySlug = locality.label.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    return localitySlug === slug;
  });
};

const getPropertiesByLocality = async (localityName: string): Promise<IProperty[]> => {
    try {
        const response = await fetch(`http://localhost:3000/api/properties?locality=${localityName}`, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            return data.properties;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch properties:', error);
        return [];
    }
};


export default async function LocalityPage({ params }: { params: { name: string } }) {
  const locality = getLocalityBySlug(params.name);

  if (!locality) {
    notFound();
  }
  
  const properties = await getPropertiesByLocality(locality.locality);

  return <LocalityClientPage initialProperties={properties} locality={locality} />;
}
