import mongoose from 'mongoose';
import Builder from '../models/Builder';
import Project from '../models/Project';

async function seedDatabase() {
  try {
    // Use the MongoDB URI from .env.local directly
    const MONGODB_URI = 'mongodb+srv://satwikmudgal_db_user:vZb90YuMIN0DNanm@cluster0.0fusjl6.mongodb.net/?appName=Cluster0';

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    await mongoose.connect(MONGODB_URI);

    // Check if builders and projects already exist
    const builderCount = await Builder.countDocuments();
    const projectCount = await Project.countDocuments();

    if (builderCount > 0 && projectCount > 0) {
      console.log('Database already seeded. Skipping seeding.');
      return;
    }

    // Create sample builders with logo images from public folder
    const builders = [
      {
        name: 'Krishna Colonisers',
        reraId: 'UPRERA/2018/001',
        logoUrl: '/logo.jpg', // Using logo from public folder
        description: 'Established in 1995, Krishna Colonisers is one of the leading real estate developers in Lucknow. Known for their quality construction and timely delivery.',
        establishedYear: 1995,
        tags: ['Premium', 'Residential', 'Commercial'],
        headquarters: {
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        website: 'https://krishna-colonisers.com'
      },
      {
        name: 'Property Boss Real Infrastructure LLP',
        reraId: 'UPRERA/2018/002',
        logoUrl: '/placeholder-logo.png', // Using placeholder logo
        description: 'A trusted name in real estate development with projects across Lucknow. Focused on creating sustainable and comfortable living spaces.',
        establishedYear: 2010,
        tags: ['Affordable', 'Plots', 'Residential'],
        headquarters: {
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        website: 'https://propertyboss.com'
      },
      {
        name: 'Sahu Land Developers Pvt Ltd',
        reraId: 'UPRERA/2018/003',
        logoUrl: '/placeholder.svg', // Using placeholder SVG
        description: 'Specialized in developing premium residential and commercial properties with modern amenities and infrastructure.',
        establishedYear: 2008,
        tags: ['Luxury', 'Residential', 'Commercial'],
        headquarters: {
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        website: 'https://sahuland.com'
      },
      {
        name: 'Township Experts',
        reraId: 'UPRERA/2018/004',
        logoUrl: '/logotext.png', // Using logotext image
        description: 'Expert in developing integrated townships with world-class amenities and sustainable architecture.',
        establishedYear: 2012,
        tags: ['Townships', 'Residential', 'Mixed'],
        headquarters: {
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        website: 'https://townshipexperts.com'
      }
    ];

    const createdBuilders = await Builder.insertMany(builders);
    console.log(`Created ${createdBuilders.length} builders`);

    // Create sample projects for each builder
    const projects = [
      {
        builderId: createdBuilders[0]._id,
        name: 'Kalyan Garden View',
        reraId: 'UPRERA/2019/001',
        location: {
          locality: 'Indira Nagar',
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        description: 'Premium residential project with modern amenities and green spaces.',
        priceRange: {
          min: 8000000,
          max: 12000000
        },
        category: 'Residential' as const,
        status: 'Ready to Move' as const,
        coverImage: '/apartment-complex.jpg', // Using image from public folder
        gallery: ['/2bhk-apartment.jpg', '/3bhk-apartment.jpg', '/modern-apartment.jpg'],
        amenities: ['Swimming Pool', 'Gym', 'Children Play Area', '24/7 Security'],
        possessionDate: new Date('2022-06-30')
      },
      {
        builderId: createdBuilders[1]._id,
        name: 'Property Boss Green Park City',
        reraId: 'UPRERA/2019/002',
        location: {
          locality: 'Sultanpur Road',
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        description: 'Residential plots in prime location with all basic amenities.',
        priceRange: {
          min: 7600000,
          max: 15000000
        },
        category: 'Residential' as const,
        status: 'Ongoing' as const,
        coverImage: '/residential-plots.jpg', // Using image from public folder
        gallery: ['/residential-plots-green.jpg', '/townhouse-garden.jpg', '/modern-villa-exterior.png'],
        amenities: ['Park', 'Club House', '24/7 Security', 'Water Supply'],
        possessionDate: new Date('2025-03-31')
      },
      {
        builderId: createdBuilders[2]._id,
        name: 'Sahu City Phase 2',
        reraId: 'UPRERA/2019/003',
        location: {
          locality: 'Sultanpur Road',
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        description: 'Luxury 2 and 3 BHK apartments with premium finishes.',
        priceRange: {
          min: 5790000,
          max: 9500000
        },
        category: 'Residential' as const,
        status: 'Ready to Move' as const,
        coverImage: '/featured-property.jpg', // Using image from public folder
        gallery: ['/2bhk-flat.jpg', '/3bhk-flat.jpg', '/4bhk-flat.jpg'],
        amenities: ['Gym', 'Swimming Pool', 'Tennis Court', 'Landscaped Gardens'],
        possessionDate: new Date('2023-12-31')
      },
      {
        builderId: createdBuilders[3]._id,
        name: 'Excella Kutumb',
        reraId: 'UPRERA/2019/004',
        location: {
          locality: 'Sultanpur Road',
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        },
        description: '2 BHK luxury apartments with modern amenities and smart features.',
        priceRange: {
          min: 5150000,
          max: 7800000
        },
        category: 'Residential' as const,
        status: 'Ongoing' as const,
        coverImage: '/modern-apartment.jpg', // Using image from public folder
        gallery: ['/luxury-apartment.jpg', '/luxury-apartment-living-room.png', '/modern-residential-building.png'],
        amenities: ['Smart Home Features', 'Gym', 'Children Play Area', 'Parking'],
        possessionDate: new Date('2024-09-30')
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log(`Created ${createdProjects.length} projects`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();