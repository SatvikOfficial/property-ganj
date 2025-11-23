import * as dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Builder from '../models/Builder';
import Project from '../models/Project';
import { SAMPLE_PROJECTS } from '../data/sampleBuilders';

async function seedProjects() {
    try {
        console.log('🔌 Connecting to database...');
        await dbConnect();

        console.log('🗑️  Clearing existing projects...');
        await Project.deleteMany({});

        console.log('🔍 Finding builders...');
        const builders = await Builder.find({});

        if (builders.length === 0) {
            console.error('❌ No builders found! Please run seed-builders.ts first.');
            await mongoose.connection.close();
            process.exit(1);
        }

        // Create a map of builder names to IDs
        const builderMap = new Map();
        builders.forEach(builder => {
            builderMap.set(builder.name, builder._id);
        });

        console.log('📦 Seeding projects...');
        const projectsWithBuilderIds = SAMPLE_PROJECTS.map(project => {
            const builderId = builderMap.get(project.builderName);
            if (!builderId) {
                console.warn(`⚠️  Builder not found: ${project.builderName}`);
                return null;
            }

            // Remove builderName and add builderId
            const { builderName, ...projectData } = project;
            return {
                ...projectData,
                builderId,
            };
        }).filter(Boolean); // Remove null entries

        const projects = await Project.insertMany(projectsWithBuilderIds);

        console.log(`✅ Successfully seeded ${projects.length} projects!`);

        projects.forEach((project) => {
            console.log(`   - ${project.name} (${project.status})`);
        });

        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding projects:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedProjects();
