import { notFound } from 'next/navigation';
import Header from '@/components/header';
import { PropertyDetailClient } from '@/components/property/PropertyDetailClient';

const propertyImages = [
  '/2bhk-apartment.jpg',
  '/3bhk-apartment.jpg',
  '/4bhk-apartment.jpg',
  '/modern-apartment.jpg',
  '/luxury-apartment.jpg',
  '/apartment-complex.jpg',
  '/residential-property.jpg',
  '/2bhk-flat.jpg',
  '/3bhk-flat.jpg',
  '/4bhk-flat.jpg',
  '/premium-apartment.jpg',
  '/modern-2bhk-apartment.jpg',
  '/apartment-interior.jpg',
  '/3bhk-luxury-living.jpg',
  '/2bhk-residential-house.jpg',
  '/3bhk-multistorey-apartment.jpg',
];

const locations = ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Aminabad', 'Chowk', 'Mahanagar'];
const propertyTypes = ['Apartment', 'Independent House/Villa', 'Plot/Land'];
const bhkOptions = [1, 2, 3, 4];

// Generate placeholder property dynamically
function generatePlaceholderProperty(id: string) {
  // Handle both placeholder-X and numeric IDs (for featured properties)
  const index = id.startsWith('placeholder-') 
    ? parseInt(id.replace('placeholder-', '')) || 0
    : parseInt(id) || 0;
  const bhk = bhkOptions[index % bhkOptions.length];
  const propertyType = propertyTypes[index % propertyTypes.length];
  const location = locations[index % locations.length];
  const isSale = index % 2 === 0;
  
  return {
    id,
    title: `${bhk} BHK ${propertyType} for ${isSale ? 'Sale' : 'Rent'}`,
    description: 'Beautiful property in prime location with all modern amenities. Well connected to major landmarks. Spacious rooms with natural lighting, modern kitchen, and premium finishes throughout. The property features excellent ventilation, modern fixtures, and is located in a well-maintained neighborhood.',
    price: (5000000 + index * 500000) * (isSale ? 1 : 0.3),
    currency: 'INR',
    purpose: (isSale ? 'sale' : 'rent') as 'sale' | 'rent',
    propertyType,
    location: {
      city: 'Lucknow',
      locality: location,
      address: `${location}, Lucknow`,
    },
    specs: {
      bedrooms: bhk,
      bathrooms: bhk,
      balconies: bhk > 2 ? 2 : 1,
      carpetArea: 1000 + (index * 100),
      areaUnit: 'sqft',
      furnishing: index % 3 === 0 ? 'Furnished' : index % 3 === 1 ? 'Semi-Furnished' : 'Unfurnished',
      floorNo: (index % 5) + 1,
      totalFloors: 4 + (index % 3),
      age: index % 3 === 0 ? 'New Construction' : index % 3 === 1 ? '1-5 years' : '5-10 years',
      facing: ['North', 'South', 'East', 'West'][index % 4],
      parking: bhk,
    },
    amenities: [
      'Power Backup',
      'Lift',
      'Parking',
      'Security',
      ...(index % 2 === 0 ? ['Swimming Pool', 'Gym'] : []),
      ...(index % 3 === 0 ? ['Garden', 'Clubhouse'] : []),
    ],
    highlights: [
      'Prime Location',
      'Well Connected',
      'Modern Amenities',
      ...(index % 2 === 0 ? ['Ready to Move'] : ['Under Construction']),
    ],
    media: {
      photos: [
        { url: propertyImages[index % propertyImages.length], category: 'exterior' as const },
        ...(index % 2 === 0 ? [{ url: propertyImages[(index + 1) % propertyImages.length], category: 'livingRoom' as const }] : []),
      ],
    },
    contact: {
      name: `Owner ${index + 1}`,
      phone: `+91 98765${String(index).padStart(5, '0')}`,
      email: `owner${index + 1}@example.com`,
    },
  };
}

// Mock placeholder property data (for similar properties)
const placeholderProperties = [
  {
    id: 'placeholder-0',
    title: '1 BHK Apartment for Sale',
    description: 'Beautiful property in prime location with all modern amenities. Well connected to major landmarks. Spacious rooms with natural lighting, modern kitchen, and premium finishes throughout.',
    price: 5000000,
    currency: 'INR',
    purpose: 'sale' as const,
    propertyType: 'Apartment',
    location: {
      city: 'Lucknow',
      locality: 'Gomti Nagar',
      address: 'Gomti Nagar, Lucknow',
    },
    specs: {
      bedrooms: 1,
      bathrooms: 1,
      carpetArea: 1000,
      areaUnit: 'sqft',
      furnishing: 'Semi-Furnished',
      floorNo: 2,
      totalFloors: 4,
    },
    amenities: ['Power Backup', 'Lift', 'Parking', 'Security'],
    highlights: ['Prime Location', 'Well Connected', 'Modern Amenities'],
    media: {
      photos: [{ url: '/2bhk-apartment.jpg', category: 'exterior' }],
    },
    contact: {
      name: 'Owner 1',
      phone: '+91 9876500000',
      email: 'owner1@example.com',
    },
  },
  {
    id: 'placeholder-1',
    title: '2 BHK Independent House/Villa for Rent',
    description: 'Beautiful property in prime location with all modern amenities. Well connected to major landmarks. Spacious rooms with natural lighting, modern kitchen, and premium finishes throughout.',
    price: 1500000,
    currency: 'INR',
    purpose: 'rent' as const,
    propertyType: 'Independent House/Villa',
    location: {
      city: 'Lucknow',
      locality: 'Hazratganj',
      address: 'Hazratganj, Lucknow',
    },
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      carpetArea: 1100,
      areaUnit: 'sqft',
      furnishing: 'Furnished',
      floorNo: 1,
      totalFloors: 2,
    },
    amenities: ['Garden', 'Parking', 'Security', 'Power Backup'],
    highlights: ['Furnished', 'Ready to Move', 'Pet Friendly'],
    media: {
      photos: [{ url: '/3bhk-apartment.jpg', category: 'exterior' }],
    },
    contact: {
      name: 'Owner 2',
      phone: '+91 9876500001',
      email: 'owner2@example.com',
    },
  },
  {
    id: 'placeholder-2',
    title: '3 BHK Plot/Land for Sale',
    description: 'Beautiful property in prime location with all modern amenities. Well connected to major landmarks. Spacious rooms with natural lighting, modern kitchen, and premium finishes throughout.',
    price: 5500000,
    currency: 'INR',
    purpose: 'sale' as const,
    propertyType: 'Plot/Land',
    location: {
      city: 'Lucknow',
      locality: 'Aliganj',
      address: 'Aliganj, Lucknow',
    },
    specs: {
      bedrooms: 3,
      carpetArea: 1200,
      areaUnit: 'sqft',
    },
    amenities: ['Gated Community', 'Near Metro', 'Parking'],
    highlights: ['Gated Community', 'Corner Plot', 'Ready to Move'],
    media: {
      photos: [{ url: '/4bhk-apartment.jpg', category: 'exterior' }],
    },
    contact: {
      name: 'Owner 3',
      phone: '+91 9876500002',
      email: 'owner3@example.com',
    },
  },
];

export default async function PlaceholderPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Handle featured properties
  const isFeatured = id.startsWith('featured-');
  const actualId = isFeatured ? id.replace('featured-', '') : id;
  
  // Generate property dynamically if it's a placeholder ID
  let property;
  if (actualId.startsWith('placeholder-')) {
    property = generatePlaceholderProperty(actualId);
  } else {
    property = placeholderProperties.find((p) => p.id === actualId) || generatePlaceholderProperty(actualId);
  }

  if (!property) {
    notFound();
  }

  // Generate similar properties
  const currentIndex = actualId.startsWith('placeholder-') 
    ? parseInt(actualId.replace('placeholder-', '')) || 0
    : parseInt(actualId) || 0;
  const similar = Array.from({ length: 4 }, (_, i) => {
    const similarIndex = (currentIndex + i + 1) % 20; // Cycle through different properties
    const similarProperty = generatePlaceholderProperty(`placeholder-${similarIndex}`);
    return {
      id: similarProperty.id,
      title: similarProperty.title,
      location: [similarProperty.location.locality, similarProperty.location.city].filter(Boolean).join(', '),
      price: similarProperty.price,
      area: similarProperty.specs?.carpetArea
        ? `${similarProperty.specs.carpetArea} ${similarProperty.specs?.areaUnit || 'sqft'}`
        : undefined,
      image: similarProperty.media?.photos?.[0]?.url,
    };
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PropertyDetailClient property={property} similar={similar} initialLiked={false} />
      <footer className="bg-primary text-primary-foreground py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2025 PropertyGanj. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

