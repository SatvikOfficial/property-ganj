import mongoose from 'mongoose';
import User from '../models/User.ts';
import connectDB from '../lib/db.ts';

const seedAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const adminEmail = 'kplmdgl@gmail.com';
        const adminPassword = 'Shefali@20';
        const adminName = 'Admin User';
        const adminPhone = '0000000000'; // Placeholder phone

        let user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('Admin user exists, updating role and password...');
            user.role = 'admin';
            user.password = adminPassword; // Will be hashed by pre-save hook
            await user.save();
            console.log('Admin user updated.');
        } else {
            console.log('Creating admin user...');
            user = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                phone: adminPhone,
                role: 'admin',
            });
            console.log('Admin user created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
