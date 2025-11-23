// Sample builders for Lucknow
export const SAMPLE_BUILDERS = [
    {
        name: "Shalimar Corp",
        reraId: "UPRERAAGT3068",
        logoUrl: "/modern-apartment.jpg",
        description: "Shalimar Corp Ltd. is one of India's leading real estate developers with over 40 years of experience in creating landmark residential and commercial properties across North India.",
        establishedYear: 1983,
        tags: ["Residential", "Commercial", "Luxury"],
        headquarters: {
            city: "Lucknow",
            state: "Uttar Pradesh"
        }
    },
    {
        name: "Eldeco Group",
        reraId: "UPRERAAGT2145",
        logoUrl: "/luxury-apartment.jpg",
        description: "Eldeco is a pioneering real estate developer in North India, known for creating world-class residential townships and commercial complexes with modern amenities.",
        establishedYear: 1985,
        tags: ["Townships", "Residential", "Premium"],
        headquarters: {
            city: "Lucknow",
            state: "Uttar Pradesh"
        }
    },
    {
        name: "Ansal API",
        reraId: "UPRERAAGT1892",
        logoUrl: "/apartment-complex.jpg",
        description: "Ansal API is one of India's oldest and most trusted real estate developers, delivering quality homes and commercial spaces for over 50 years.",
        establishedYear: 1967,
        tags: ["Residential", "Commercial", "Affordable"],
        headquarters: {
            city: "Lucknow",
            state: "Uttar Pradesh"
        }
    },
    {
        name: "Omaxe Ltd",
        reraId: "UPRERAAGT3421",
        logoUrl: "/residential-property.jpg",
        description: "Omaxe is a leading real estate development company specializing in integrated townships, group housing, and commercial developments across India.",
        establishedYear: 1987,
        tags: ["Townships", "Group Housing", "Commercial"],
        headquarters: {
            city: "Lucknow",
            state: "Uttar Pradesh"
        }
    },
    {
        name: "Paarth Infrabuild",
        reraId: "UPRERAAGT2789",
        logoUrl: "/premium-apartment.jpg",
        description: "Paarth Infrabuild is a rapidly growing real estate company in Lucknow, known for innovative designs and timely delivery of premium residential projects.",
        establishedYear: 2008,
        tags: ["Residential", "Premium", "Modern"],
        headquarters: {
            city: "Lucknow",
            state: "Uttar Pradesh"
        }
    },
    {
        name: "Sahara Group",
        reraId: "UPRERAAGT1567",
        logoUrl: "/4bhk-apartment.jpg",
        description: "Sahara Group is a diversified conglomerate with significant presence in real estate, known for creating iconic residential and commercial landmarks.",
        establishedYear: 1978,
        tags: ["Luxury", "Commercial", "Residential"],
        headquarters: {
            city: "Lucknow",
            state: "Uttar Pradesh"
        }
    }
];

// Sample projects for each builder
export const SAMPLE_PROJECTS = [
    // Shalimar Corp Projects
    {
        builderName: "Shalimar Corp",
        name: "Shalimar Gallant",
        reraId: "UPRERAPRJ123456",
        location: { locality: "Aliganj", city: "Lucknow" },
        description: "Premium residential apartments with world-class amenities",
        priceRange: { min: 4500000, max: 8500000 },
        category: "Residential",
        status: "Ongoing",
        coverImage: "/2bhk-apartment.jpg",
        gallery: [],
        amenities: ["Swimming Pool", "Gym", "Club House", "Kids Play Area", "24/7 Security"]
    },
    {
        builderName: "Shalimar Corp",
        name: "Shalimar Courtyard",
        reraId: "UPRERAPRJ123457",
        location: { locality: "Gomti Nagar Extension", city: "Lucknow" },
        description: "Spacious 3 & 4 BHK apartments in prime location",
        priceRange: { min: 6000000, max: 12000000 },
        category: "Residential",
        status: "Ready to Move",
        coverImage: "/3bhk-apartment.jpg",
        gallery: [],
        amenities: ["Clubhouse", "Gym", "Garden", "Power Backup", "Parking"]
    },

    // Eldeco Group Projects
    {
        builderName: "Eldeco Group",
        name: "Eldeco Elegante",
        reraId: "UPRERAPRJ234567",
        location: { locality: "Vrindavan Yojana", city: "Lucknow" },
        description: "Luxury apartments with modern architecture",
        priceRange: { min: 5500000, max: 9500000 },
        category: "Residential",
        status: "New Launch",
        coverImage: "/4bhk-apartment.jpg",
        gallery: [],
        amenities: ["Swimming Pool", "Spa", "Gym", "Jogging Track", "Security"]
    },
    {
        builderName: "Eldeco Group",
        name: "Eldeco Utopia",
        reraId: "UPRERAPRJ234568",
        location: { locality: "IIM Road", city: "Lucknow" },
        description: "Premium residential project with green spaces",
        priceRange: { min: 7000000, max: 15000000 },
        category: "Residential",
        status: "Ongoing",
        coverImage: "/modern-apartment.jpg",
        gallery: [],
        amenities: ["Park", "Clubhouse", "Gym", "Kids Area", "Security"]
    },

    // Ansal API Projects
    {
        builderName: "Ansal API",
        name: "Ansal Sushant Estate",
        reraId: "UPRERAPRJ345678",
        location: { locality: "Shaheed Path", city: "Lucknow" },
        description: "Affordable housing with modern amenities",
        priceRange: { min: 3500000, max: 6500000 },
        category: "Residential",
        status: "Ready to Move",
        coverImage: "/luxury-apartment.jpg",
        gallery: [],
        amenities: ["Park", "Security", "Power Backup", "Parking", "Water Supply"]
    },
    {
        builderName: "Ansal API",
        name: "Ansal Woodbury",
        reraId: "UPRERAPRJ345679",
        location: { locality: "Kanpur Road", city: "Lucknow" },
        description: "Well-planned residential township",
        priceRange: { min: 4000000, max: 7500000 },
        category: "Residential",
        status: "Ongoing",
        coverImage: "/apartment-complex.jpg",
        gallery: [],
        amenities: ["Clubhouse", "Park", "School", "Shopping Complex", "Security"]
    },

    // Omaxe Projects
    {
        builderName: "Omaxe Ltd",
        name: "Omaxe Heights",
        reraId: "UPRERAPRJ456789",
        location: { locality: "Gomti Nagar", city: "Lucknow" },
        description: "High-rise apartments with panoramic views",
        priceRange: { min: 8000000, max: 16000000 },
        category: "Residential",
        status: "New Launch",
        coverImage: "/residential-property.jpg",
        gallery: [],
        amenities: ["Infinity Pool", "Gym", "Spa", "Terrace Garden", "Concierge"]
    },
    {
        builderName: "Omaxe Ltd",
        name: "Omaxe Residency",
        reraId: "UPRERAPRJ456790",
        location: { locality: "Faizabad Road", city: "Lucknow" },
        description: "Integrated township with all facilities",
        priceRange: { min: 5000000, max: 10000000 },
        category: "Mixed",
        status: "Ongoing",
        coverImage: "/2bhk-flat.jpg",
        gallery: [],
        amenities: ["Mall", "Hospital", "School", "Park", "Security"]
    },

    // Paarth Projects
    {
        builderName: "Paarth Infrabuild",
        name: "Paarth NU",
        reraId: "UPRERAPRJ567890",
        location: { locality: "Kanpur Road", city: "Lucknow" },
        description: "Modern apartments with smart home features",
        priceRange: { min: 4800000, max: 8800000 },
        category: "Residential",
        status: "Ongoing",
        coverImage: "/3bhk-flat.jpg",
        gallery: [],
        amenities: ["Smart Home", "Gym", "Pool", "Garden", "Security"]
    },
    {
        builderName: "Paarth Infrabuild",
        name: "Paarth Aadyant",
        reraId: "UPRERAPRJ567891",
        location: { locality: "Gomti Nagar Extension", city: "Lucknow" },
        description: "Premium living with eco-friendly design",
        priceRange: { min: 6500000, max: 12500000 },
        category: "Residential",
        status: "New Launch",
        coverImage: "/4bhk-flat.jpg",
        gallery: [],
        amenities: ["Rainwater Harvesting", "Solar Panels", "Gym", "Park", "Clubhouse"]
    },

    // Sahara Projects
    {
        builderName: "Sahara Group",
        name: "Sahara City Homes",
        reraId: "UPRERAPRJ678901",
        location: { locality: "Jankipuram", city: "Lucknow" },
        description: "Luxury villas and apartments",
        priceRange: { min: 9000000, max: 20000000 },
        category: "Residential",
        status: "Ready to Move",
        coverImage: "/premium-apartment.jpg",
        gallery: [],
        amenities: ["Private Pool", "Garden", "Gym", "Clubhouse", "Concierge"]
    },
    {
        builderName: "Sahara Group",
        name: "Sahara Grace",
        reraId: "UPRERAPRJ678902",
        location: { locality: "Hazratganj", city: "Lucknow" },
        description: "Premium commercial and residential complex",
        priceRange: { min: 7500000, max: 18000000 },
        category: "Mixed",
        status: "Ongoing",
        coverImage: "/modern-2bhk-apartment.jpg",
        gallery: [],
        amenities: ["Shopping Mall", "Office Spaces", "Gym", "Parking", "Security"]
    }
];
