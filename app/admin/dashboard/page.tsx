import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import { verifyAuthToken } from '@/lib/auth';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = verifyAuthToken(token);

    if (!payload) {
        notFound(); // Or redirect to login, but requirement says 404 for non-admins
    }

    const user = await User.findById(payload.userId);

    // Strict check for the specific admin email and role
    if (!user || user.email !== 'kplmdgl@gmail.com' || user.role !== 'admin') {
        notFound();
    }

    // Fetch data
    const [
        listings,
        agents,
        totalListings,
        totalAgents,
        totalUsers
    ] = await Promise.all([
        Property.find().populate('listedBy', 'name email').lean(),
        User.find({ role: 'agent' }).lean(),
        Property.countDocuments(),
        User.countDocuments({ role: 'agent' }),
        User.countDocuments(),
    ]);

    // Serialize data to pass to client component
    const serializedListings = listings.map((l: any) => ({
        ...l,
        _id: l._id.toString(),
        listedBy: l.listedBy ? { ...l.listedBy, _id: l.listedBy._id.toString() } : null,
        createdAt: l.createdAt?.toISOString(),
        updatedAt: l.updatedAt?.toISOString(),
        // Handle other ObjectId fields if necessary
        location: l.location || { city: '', locality: '' },
    }));

    const serializedAgents = agents.map((a: any) => ({
        ...a,
        _id: a._id.toString(),
        createdAt: a.createdAt?.toISOString(),
        updatedAt: a.updatedAt?.toISOString(),
        likedProperties: a.likedProperties?.map((id: any) => id.toString()) || [],
    }));

    return (
        <AdminDashboardClient
            initialListings={serializedListings}
            initialAgents={serializedAgents}
            stats={{
                totalListings,
                totalAgents,
                totalUsers,
            }}
        />
    );
}
