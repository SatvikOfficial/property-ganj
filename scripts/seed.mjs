import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize with Service Role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRid3JiZW1ybWJ3Y2NnZGRjYmJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ0NDA0NSwiZXhwIjoyMDc4MDIwMDQ1fQ.XDVWHuUgLIoR4OcTKhu2HrMVcrN-yHYxwuLVMJdEaJY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Realistic property titles and images mapped to types
const propertyOptions = {
  apartment: [
    { title: "Modern 3BHK Apartment in Gomti Nagar", suffix: "Apartment", priceBase: 8000000, img: ["/modern-apartment.jpg", "/3bhk-apartment.jpg"] },
    { title: "Cozy 2BHK Flat for Rent", suffix: "Flat", priceBase: 22000, rent: true, img: ["/2bhk-flat.jpg", "/2bhk-apartment.jpg"] },
    { title: "Luxury Penthouse with City View", suffix: "Penthouse", priceBase: 21000000, img: ["/luxury-apartment.jpg", "/apartment-complex.jpg"] },
    { title: "Premium 4BHK Flat in Mahanagar", suffix: "Apartment", priceBase: 18500000, img: ["/premium-apartment.jpg", "/4bhk-apartment.jpg"] },
    { title: "Studio Apartment for Bachelors", suffix: "Studio", priceBase: 18000, rent: true, img: ["/modern-apartment.jpg"] }
  ],
  villa: [
    { title: "Premium 4BHK Villa in Sushant Golf City", suffix: "Villa", priceBase: 15000000, img: ["/residential-property.jpg", "/luxury-apartment.jpg"] },
    { title: "Beautiful Townhouse with Garden", suffix: "Townhouse", priceBase: 11500000, img: ["/residential-property.jpg"] },
    { title: "Affordable 2BHK House in Manas Vihar", suffix: "Independent House", priceBase: 3500000, img: ["/2bhk-apartment.jpg"] },
    { title: "Luxury Residential Villa", suffix: "Villa", priceBase: 25000000, img: ["/residential-property.jpg"] }
  ],
  plot: [
    { title: "Residential Plot in Kishan Path", suffix: "Plot", priceBase: 4500000, img: ["/residential-plots-green.jpg"] },
    { title: "Large Residential Plot near Airport", suffix: "Plot", priceBase: 8500000, img: ["/residential-plots.jpg"] }
  ]
};

const localities = ["Gomti Nagar", "Sushant Golf City", "Aliganj", "Hazratganj", "Indira Nagar", "Mahanagar", "Vikas Nagar", "Kanpur Road", "IIM Road"];

const generateProperty = (ownerId, role, index) => {
  const isRent = Math.random() > 0.7; // 30% are rent
  let typeKey = 'apartment';
  const rand = Math.random();
  if (rand > 0.6) typeKey = 'villa';
  else if (rand > 0.5) typeKey = 'plot';
  
  const options = propertyOptions[typeKey];
  const template = options[Math.floor(Math.random() * options.length)];
  
  const isActuallyRent = template.rent || isRent;
  const thePrice = isActuallyRent ? Math.floor(template.priceBase / 300) + Math.floor(Math.random() * 10000) : template.priceBase + (Math.floor(Math.random() * 2000000));
  
  const locality = localities[Math.floor(Math.random() * localities.length)];
  
  let dbPropType = typeKey;
  if (typeKey === 'villa') dbPropType = 'house';
  else if (typeKey === 'plot') dbPropType = 'land';
  
  return {
    title: `${template.title} #${index}`,
    description: `A genuinely magnificent ${template.suffix} configured for premium lifestyle. Operated by a verified ${role}. Located in the heart of ${locality}. \n\nContact: ${role === 'agent' ? 'Agent' : role === 'builder' ? 'Builder' : 'Owner'} (+9198765${Math.floor(10000 + Math.random() * 90000)})`,
    property_type: dbPropType,
    price: isActuallyRent ? null : thePrice,
    rent: isActuallyRent ? thePrice : null,
    owner_user_id: ownerId,
    city: "Lucknow",
    locality: locality,
    address_line1: `Sector ${Math.floor(Math.random() * 20)}, ${locality}`,
    formatted_address: `${locality}, Lucknow, UP`,
    bedrooms: typeKey === 'plot' ? 0 : Math.floor(Math.random() * 3) + 2,
    bathrooms: typeKey === 'plot' ? 0 : Math.floor(Math.random() * 2) + 2,
    carpet_area_sqft: (Math.floor(Math.random() * 10) + 10) * 100,
    built_up_area_sqft: (Math.floor(Math.random() * 10) + 12) * 100,
    for_sale: !isActuallyRent,
    for_rent: isActuallyRent,
    status: 'published',
    provider: template.img[0], // Store primary image in provider
  };
};

async function seedData() {
  console.log("🚀 Starting PropertyGanj database seed...\n");
  
  const roles = [
    { role: 'agent', count: 5, prefix: 'Agent' },
    { role: 'builder', count: 3, prefix: 'Builder' },
    { role: 'user', count: 5, prefix: 'Owner' }
  ];
  
  let totalProperties = 0;
  let defaultOwnerId = null;

  for (const r of roles) {
    console.log(`\n--- Seeding ${r.count} ${r.role}s ---`);
    for (let i = 1; i <= r.count; i++) {
      const email = `${r.role}${i}_${Date.now()}@propertyganj.seed`;
      const fullName = `${r.prefix} ${['Sharma', 'Gupta', 'Singh', 'Verma', 'Patel'][i-1] || 'User'} ${i}`;
      const phone = `+9198765${Math.floor(10000 + Math.random() * 90000)}`;
      
      console.log(`Creating user: ${email}`);
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password: 'StrongPassword123!',
        email_confirm: true,
        user_metadata: { full_name: fullName, phone, role: r.role }
      });
      
      if (userError) {
        console.error(`User creation failed for ${email}:`, userError.message);
        continue;
      }
      
      const userId = userData.user.id;
      if (!defaultOwnerId) defaultOwnerId = userId;
      
      // Upsert profile
      const profilePayload = {
        user_id: userId,
        full_name: fullName,
        email,
        phone,
        role: r.role,
        phone_verified: true,
      };

      if (r.role === 'agent') {
        Object.assign(profilePayload, {
          agent_is_verified: true,
          agent_experience: Math.floor(Math.random() * 15) + 2,
          agent_specialization: ["Residential", "Commercial", "Plots"].slice(0, Math.floor(Math.random() * 3) + 1),
          agent_languages: ["English", "Hindi"].slice(0, Math.floor(Math.random() * 2) + 1),
          agent_location: "Lucknow",
          agent_bio: `Expert property consultant specializing in premium listings across Lucknow.`
        });
      }

      await supabase.from('profiles').upsert(profilePayload);
      
      // Generate properties (agents get more to fill "Listed by Agents" section)
      let numProps = r.role === 'agent' ? 5 : r.role === 'builder' ? 3 : 3;
      const propsToInsert = [];
      for (let p = 1; p <= numProps; p++) {
        propsToInsert.push(generateProperty(userId, r.role, p));
      }
      
      const { error: propError } = await supabase.from('properties').insert(propsToInsert);
      if (propError) {
        console.error("Property insert failed:", propError.message);
      } else {
        totalProperties += propsToInsert.length;
        console.log(`-> Inserted ${propsToInsert.length} properties for ${fullName}.`);
      }
    }
  }

  // Seed Property Ganj listings (properties with address_line2 = 'pg_listing')
  console.log("\n--- Seeding Property Ganj Featured Listings ---");
  const pgListings = [
    {
      title: "Ganj Premium 3BHK in Gomti Nagar",
      formatted_address: "Gomti Nagar Extension, Lucknow",
      locality: "Gomti Nagar Extension",
      property_type: "apartment",
      price: 9500000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "pg_listing",
      provider: "/modern-apartment.jpg",
      bedrooms: 3
    },
    {
      title: "Ganj Curated Villa in Sushant Golf City",
      formatted_address: "Sushant Golf City, Lucknow",
      locality: "Sushant Golf City",
      property_type: "house",
      price: 18000000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "pg_listing",
      provider: "/residential-property.jpg",
      bedrooms: 4
    },
    {
      title: "Ganj Select Plot on IIM Road",
      formatted_address: "IIM Road, Lucknow",
      locality: "IIM Road",
      property_type: "land",
      price: 4500000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "pg_listing",
      provider: "/residential-plots-green.jpg",
      bedrooms: 0
    },
    {
      title: "Ganj Exclusive 2BHK in Hazratganj",
      formatted_address: "Hazratganj, Lucknow",
      locality: "Hazratganj",
      property_type: "apartment",
      price: 5200000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "pg_listing",
      provider: "/2bhk-apartment.jpg",
      bedrooms: 2
    }
  ];

  const { error: pgError } = await supabase.from('properties').insert(pgListings);
  if (pgError) {
    console.error("PG Listings insert failed:", pgError.message);
  } else {
    console.log(`-> Inserted ${pgListings.length} Property Ganj curated listings.`);
  }

  // Seed regular featured projects
  console.log("\n--- Seeding Regular Featured Projects ---");
  const regularFeatured = [
    {
      title: "Kalyan Garden View",
      formatted_address: "Indira Nagar, Lucknow",
      locality: "Indira Nagar",
      property_type: "apartment",
      price: 8030000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "featured",
      provider: "/apartment-complex.jpg",
      bedrooms: 3,
      description: "A premium project by Krishna Colonisers"
    },
    {
      title: "Green Park City",
      formatted_address: "Sultanpur Road, Lucknow",
      locality: "Sultanpur Road",
      property_type: "land",
      price: 760000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "featured",
      provider: "/residential-plots.jpg",
      bedrooms: 0,
      description: "Premium property by Property Boss Real Infrastructure LLP"
    },
    {
      title: "Sahu City Phase 2",
      formatted_address: "Sultanpur Road, Lucknow",
      locality: "Sultanpur Road",
      property_type: "apartment",
      price: 5790000,
      for_sale: true,
      owner_user_id: defaultOwnerId,
      status: "published",
      address_line2: "featured",
      provider: "/featured-property.jpg",
      bedrooms: 2,
      description: "Premium property by Sahu Land Developers Pvt Ltd"
    }
  ];

  const { error: rfError } = await supabase.from('properties').insert(regularFeatured);
  if (rfError) {
    console.error("Featured projects insert failed:", rfError.message);
  } else {
    console.log(`-> Inserted ${regularFeatured.length} regular featured projects.`);
  }
  
  console.log(`\n✅ Seeding complete! Added ${totalProperties} properties, 13 users, ${pgListings.length} PG listings, and ${regularFeatured.length} featured projects.`);
}

seedData();
