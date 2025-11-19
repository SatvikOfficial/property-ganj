import Header from '@/components/header';
import { PropertyDetailClient } from '@/components/property/PropertyDetailClient';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id:string }> }) {
  const { id } = await params;

  // Placeholder data
  const property = {
    id: id,
    title: 'Spacious 3BHK Apartment in the Heart of the City',
    description:
      'A beautiful and spacious 3BHK apartment located in a prime location. This property is perfect for families looking for a comfortable and modern living space. The apartment is well-ventilated and receives ample natural light. It is situated in a friendly neighborhood with easy access to schools, hospitals, and shopping centers.',
    price: 7500000,
    currency: 'INR',
    purpose: 'sell',
    propertyType: 'apartment',
    location: {
      city: 'Lucknow',
      locality: 'Hazratganj',
      area: '1800 sqft',
      address: '123, MG Marg, Hazratganj, Lucknow, Uttar Pradesh 226001',
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      carpetArea: '1800',
      areaUnit: 'sqft',
    },
    amenities: ['Lift', 'Power Backup', 'Security', 'Parking', 'Gymnasium'],
    highlights: [
      'Prime location',
      'Modern architecture',
      'Close to metro station',
      '24/7 water supply',
    ],
    media: {
      photos: [
        { url: '/3bhk-apartment-interior.jpg' },
        { url: '/3bhk-apartment.jpg' },
        { url: '/3bhk-flat-staircase.jpg' },
      ],
      videoUrl: '',
    },
    contact: {
      name: 'Satvik Mudgal',
      phone: '+91-9876543210',
      email: 'satvik.mudgal@example.com',
    },
  };

  const similar = [
    {
      id: '1',
      title: '2BHK Flat for Sale',
      location: 'Indiranagar, Lucknow',
      price: 5000000,
      area: '1200 sqft',
      image: '/2bhk-flat.jpg',
    },
    {
      id: '2',
      title: 'Luxury Villa in Gomti Nagar',
      location: 'Gomti Nagar, Lucknow',
      price: 15000000,
      area: '3000 sqft',
      image: '/modern-villa-exterior.png',
    },
    {
      id: '3',
      title: '4BHK Penthouse with City View',
      location: 'Hazratganj, Lucknow',
      price: 25000000,
      area: '4000 sqft',
      image: '/penthouse-city-view.png',
    },
    {
      id: '4',
      title: '1BHK Studio Apartment',
      location: 'Aliganj, Lucknow',
      price: 3000000,
      area: '800 sqft',
      image: '/studio-apartment-modern.jpg',
    },
  ];

  const isLiked = false;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PropertyDetailClient property={property} similar={similar} initialLiked={isLiked} />
    </main>
  );
}
