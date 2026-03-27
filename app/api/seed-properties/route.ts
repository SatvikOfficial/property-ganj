import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const diverseProperties = [
  {
    title: "Modern 3BHK Apartment in Gomti Nagar",
    description: "A beautiful, fully furnished 3BHK apartment in the heart of Gomti Nagar with luxury amenities.",
    property_type: "apartment",
    price: 8500000,
    city: "Lucknow",
    locality: "Gomti Nagar",
    address_line1: "Gomti Nagar, Near Wave Mall",
    bedrooms: 3,
    bathrooms: 3,
    carpet_area_sqft: 1500,
    built_up_area_sqft: 1800,
    for_sale: true,
    for_rent: false,
    photos: ["/modern-apartment.jpg", "/3bhk-apartment-interior.jpg"],
    status: "published"
  },
  {
    title: "Premium 4BHK Villa in Sushant Golf City",
    description: "Spacious independent villa with a private garden, modular kitchen, and smart home automation.",
    property_type: "independent house/villa",
    price: 15000000,
    city: "Lucknow",
    locality: "Sushant Golf City",
    address_line1: "Sector A, Sushant Golf City",
    bedrooms: 4,
    bathrooms: 4,
    carpet_area_sqft: 2200,
    built_up_area_sqft: 2500,
    for_sale: true,
    for_rent: false,
    photos: ["/modern-villa-exterior.png", "/luxury-apartment-living-room.png"],
    status: "published"
  },
  {
    title: "Cozy 2BHK Flat for Rent in Aliganj",
    description: "Perfect for small families. Near the main market and metro station. Semi-furnished.",
    property_type: "apartment",
    price: 22000,
    city: "Lucknow",
    locality: "Aliganj",
    address_line1: "Sector B, Aliganj",
    bedrooms: 2,
    bathrooms: 2,
    carpet_area_sqft: 900,
    built_up_area_sqft: 1100,
    for_sale: false,
    for_rent: true,
    photos: ["/2bhk-flat.jpg", "/cozy-apartment-bedroom.png"],
    status: "published"
  },
  {
    title: "Luxury Penthouse with City View",
    description: "Top floor penthouse facing the skyline. Comes with a private terrace and premium fixtures.",
    property_type: "apartment",
    price: 21000000,
    city: "Lucknow",
    locality: "Hazratganj",
    address_line1: "Hazratganj Main Road",
    bedrooms: 4,
    bathrooms: 5,
    carpet_area_sqft: 3000,
    built_up_area_sqft: 3500,
    for_sale: true,
    for_rent: false,
    photos: ["/penthouse-city-view.png", "/apartment-interior.jpg"],
    status: "published"
  },
  {
    title: "Residential Plot in Kishan Path",
    description: "East facing plot ready for construction. Gated society with 24x7 security and parks.",
    property_type: "plot/land",
    price: 4500000,
    city: "Lucknow",
    locality: "Kishan Path",
    address_line1: "Kishan Path Highway",
    bedrooms: 0,
    bathrooms: 0,
    carpet_area_sqft: 1200,
    built_up_area_sqft: 1200,
    for_sale: true,
    for_rent: false,
    photos: ["/residential-plots-green.jpg"],
    status: "published"
  },
  {
    title: "Commercial Office Space in Indira Nagar",
    description: "Fully furnished office space suitable for IT startups or consulting firms. 5 cabins.",
    property_type: "commercial",
    price: 45000,
    city: "Lucknow",
    locality: "Indira Nagar",
    address_line1: "Munshi Pulia, Indira Nagar",
    bedrooms: 0,
    bathrooms: 2,
    carpet_area_sqft: 1800,
    built_up_area_sqft: 2000,
    for_sale: false,
    for_rent: true,
    photos: ["/office-commercial-space.jpg"],
    status: "published"
  },
  {
    title: "Spacious 3BHK Flat near IIM Road",
    description: "Brand new flat in a high-rise building with swimming pool, gym, and clubhouse access.",
    property_type: "apartment",
    price: 6800000,
    city: "Lucknow",
    locality: "IIM Road",
    address_line1: "Near IIM Lucknow Campus",
    bedrooms: 3,
    bathrooms: 2,
    carpet_area_sqft: 1350,
    built_up_area_sqft: 1600,
    for_sale: true,
    for_rent: false,
    photos: ["/3bhk-multistorey-apartment.jpg", "/3bhk-flat-staircase.jpg"],
    status: "published"
  },
  {
    title: "Beautiful Townhouse with Garden",
    description: "A serene townhouse in a premium locality. Comes with Italian marble flooring.",
    property_type: "independent house/villa",
    price: 11500000,
    city: "Lucknow",
    locality: "Vikas Nagar",
    address_line1: "Vikas Nagar Sector 2",
    bedrooms: 3,
    bathrooms: 3,
    carpet_area_sqft: 1800,
    built_up_area_sqft: 2000,
    for_sale: true,
    for_rent: false,
    photos: ["/townhouse-garden.jpg"],
    status: "published"
  },
  {
    title: "Affordable 2BHK House in Manas Vihar",
    description: "Independent small house perfect for nuclear family. Ready to move.",
    property_type: "independent house/villa",
    price: 3500000,
    city: "Lucknow",
    locality: "Manas Vihar",
    address_line1: "Manas Vihar, Kursi Road",
    bedrooms: 2,
    bathrooms: 1,
    carpet_area_sqft: 800,
    built_up_area_sqft: 950,
    for_sale: true,
    for_rent: false,
    photos: ["/2bhk-house-manas-vihar.jpg", "/2bhk-apartment-living-room.jpg"],
    status: "published"
  },
  {
    title: "Modern Studio Apartment in Gomti Nagar",
    description: "Perfect for bachelors or young professionals. Fully furnished with modular kitchen.",
    property_type: "apartment",
    price: 18000,
    city: "Lucknow",
    locality: "Gomti Nagar",
    address_line1: "Vibhuti Khand",
    bedrooms: 1,
    bathrooms: 1,
    carpet_area_sqft: 500,
    built_up_area_sqft: 600,
    for_sale: false,
    for_rent: true,
    photos: ["/studio-apartment-modern.jpg"],
    status: "published"
  },
  {
    title: "Large Residential Plot near Airport",
    description: "Excellent investment opportunity. Close to the proposed metro line extension.",
    property_type: "plot/land",
    price: 8500000,
    city: "Lucknow",
    locality: "Kanpur Road",
    address_line1: "Near Amausi Airport",
    bedrooms: 0,
    bathrooms: 0,
    carpet_area_sqft: 2000,
    built_up_area_sqft: 2000,
    for_sale: true,
    for_rent: false,
    photos: ["/residential-plots.jpg"],
    status: "published"
  },
  {
    title: "Premium 4BHK Flat in Mahanagar",
    description: "Ultra luxury flat centrally located. Two car parkings allocated.",
    property_type: "apartment",
    price: 18500000,
    city: "Lucknow",
    locality: "Mahanagar",
    address_line1: "Gole Market area",
    bedrooms: 4,
    bathrooms: 4,
    carpet_area_sqft: 2100,
    built_up_area_sqft: 2600,
    for_sale: true,
    for_rent: false,
    photos: ["/premium-apartment.jpg", "/4bhk-apartment.jpg"],
    status: "published"
  }
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Attach the admin user id as the owner of these seeded properties
    const toInsert = diverseProperties.map(p => ({
      ...p,
      owner_user_id: user.id
    }));

    const { error } = await supabase.from('properties').insert(toInsert);

    if (error) {
      console.error('Seeding error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: diverseProperties.length }, { status: 201 });
  } catch (error: any) {
    console.error('Unknown error parsing seed requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
