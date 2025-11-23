import dbConnect from '@/lib/db';
import Builder from '@/models/Builder';
import Project from '@/models/Project';
import Property from '@/models/Property';
import { SAMPLE_BUILDERS, SAMPLE_PROJECTS } from '@/data/sampleBuilders';

async function seedDatabase() {
    try {
        await dbConnect();
        console.log('Connected to database');

        // Create builders
        const builderMap = new Map();

        for (const builderData of SAMPLE_BUILDERS) {
            const existing = await Builder.findOne({ reraId: builderData.reraId });

            if (!existing) {
                const builder = await Builder.create(builderData);
                builderMap.set(builderData.name, builder._id);
                console.log(`Created builder: ${builderData.name}`);
            } else {
                builderMap.set(builderData.name, existing._id);
                console.log(`Builder already exists: ${builderData.name}`);
            }
        }

        // Create projects
        const projectMap = new Map();

        for (const projectData of SAMPLE_PROJECTS) {
            const builderId = builderMap.get(projectData.builderName);

            if (!builderId) {
                console.log(`Builder not found for project: ${projectData.name}`);
                continue;
            }

            const existing = await Project.findOne({ reraId: projectData.reraId });

            if (!existing) {
                const project = await Project.create({
                    builderId,
                    name: projectData.name,
                    reraId: projectData.reraId,
                    location: {
                        locality: projectData.locality,
                        city: 'Lucknow',
                        state: 'Uttar Pradesh'
                    },
                    description: projectData.description,
                    priceRange: projectData.priceRange,
                    category: projectData.category,
                    status: projectData.status,
                    amenities: projectData.amenities,
                    gallery: []
                });
                projectMap.set(projectData.name, project._id);
                console.log(`Created project: ${projectData.name}`);
            } else {
                projectMap.set(projectData.name, existing._id);
                console.log(`Project already exists: ${projectData.name}`);
            }
        }

        // Create sample properties for each project
        const propertyTypes = ['Apartment', 'Villa', 'Penthouse'];
        const bhkOptions = [2, 3, 4];
        const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

        for (const [projectName, projectId] of projectMap.entries()) {
            const project = await Project.findById(projectId).populate('builderId');
            if (!project) continue;

            // Create 6-7 properties per project
            const numProperties = 6 + Math.floor(Math.random() * 2);

            for (let i = 0; i < numProperties; i++) {
                const bhk = bhkOptions[Math.floor(Math.random() * bhkOptions.length)];
                const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
                const basePrice = project.priceRange.min + (project.priceRange.max - project.priceRange.min) * Math.random();
                const carpetArea = 800 + Math.floor(Math.random() * 1200);

                const propertyData = {
                    title: `${bhk} BHK ${propertyType} in ${projectName}`,
                    description: `Spacious ${bhk} BHK ${propertyType} with modern amenities in ${project.location.locality}`,
                    purpose: 'sale',
                    propertyType,
                    ownerType: 'builder',
                    listedBy: project.builderId._id,
                    projectId: project._id,
                    builderId: project.builderId._id,
                    price: Math.round(basePrice),
                    currency: 'INR',
                    location: {
                        locality: project.location.locality,
                        city: 'Lucknow',
                        state: 'Uttar Pradesh',
                        pincode: '226001'
                    },
                    specs: {
                        bedrooms: bhk,
                        bathrooms: bhk,
                        balconies: 1 + Math.floor(Math.random() * 2),
                        parking: 1 + Math.floor(Math.random() * 2),
                        carpetArea,
                        builtUpArea: Math.round(carpetArea * 1.2),
                        areaUnit: 'sqft',
                        furnishing: furnishingOptions[Math.floor(Math.random() * furnishingOptions.length)],
                        floorNo: 1 + Math.floor(Math.random() * 15),
                        totalFloors: 15 + Math.floor(Math.random() * 10),
                        facing: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]
                    },
                    amenities: project.amenities.slice(0, 5),
                    tags: ['Premium', 'Gated Community', 'RERA Approved'],
                    media: {
                        photos: [
                            {
                                url: [
                                    "/2bhk-apartment.jpg",
                                    "/3bhk-apartment.jpg",
                                    "/4bhk-apartment.jpg",
                                    "/modern-apartment.jpg",
                                    "/luxury-apartment.jpg",
                                    "/apartment-complex.jpg",
                                    "/residential-property.jpg",
                                    "/2bhk-flat.jpg",
                                    "/3bhk-flat.jpg",
                                    "/4bhk-flat.jpg",
                                    "/premium-apartment.jpg",
                                    "/modern-2bhk-apartment.jpg"
                                ][i % 12],
                                category: 'exterior'
                            }
                        ]
                    },
                    contact: {
                        name: project.builderId.name,
                        phone: '9876543210',
                        email: 'sales@builder.com'
                    },
                    highlights: [
                        `${bhk} BHK ${propertyType}`,
                        `${carpetArea} sqft carpet area`,
                        `Located in ${project.location.locality}`,
                        'RERA Approved Project'
                    ],
                    status: 'published'
                };

                await Property.create(propertyData);
                console.log(`Created property: ${propertyData.title}`);
            }
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
