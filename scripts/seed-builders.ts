import * as dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Builder from '../models/Builder';
import { SAMPLE_BUILDERS } from '../data/sampleBuilders';

async function seedBuilders() {
    try {
        console.log('🔌 Connecting to database...');
        await dbConnect();

        console.log('🗑️  Clearing existing builders...');
        await Builder.deleteMany({});

        console.log('📦 Seeding builders...');
        const builders = await Builder.insertMany(SAMPLE_BUILDERS);

        console.log(`✅ Successfully seeded ${builders.length} builders!`);

        builders.forEach((builder) => {
            console.log(`   - ${builder.name} (${builder.reraId})`);
        });

        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding builders:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedBuilders();
