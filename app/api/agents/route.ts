import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        // Fetch users with role 'agent' and select relevant fields
        // We only want agents who have completed their profile
        let agents = await User.find({ role: 'agent' })
            .select('name agentProfile email phone')
            .lean();

        if (agents.length === 0) {
            agents = [
                {
                    _id: 'dummy1',
                    name: 'Rajesh Kumar',
                    agentProfile: {
                        specialization: 'Residential',
                        experience: 12,
                        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
                        bio: 'Expert in premium residential properties in Gomti Nagar.',
                        location: 'Gomti Nagar'
                    },
                    email: 'rajesh@example.com',
                    phone: '+91 98765 43210'
                },
                {
                    _id: 'dummy2',
                    name: 'Priya Singh',
                    agentProfile: {
                        specialization: 'Commercial',
                        experience: 8,
                        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
                        bio: 'Helping businesses find the perfect office space in Hazratganj.',
                        location: 'Hazratganj'
                    },
                    email: 'priya@example.com',
                    phone: '+91 98765 43211'
                },
                {
                    _id: 'dummy3',
                    name: 'Amit Verma',
                    agentProfile: {
                        specialization: 'Land/Plots',
                        experience: 15,
                        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
                        bio: 'Specialist in investment plots and land deals across Lucknow.',
                        location: 'Amar Shaheed Path'
                    },
                    email: 'amit@example.com',
                    phone: '+91 98765 43212'
                },
                {
                    _id: 'dummy4',
                    name: 'Sneha Gupta',
                    agentProfile: {
                        specialization: 'Luxury Homes',
                        experience: 5,
                        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
                        bio: 'Curating luxury living experiences for discerning clients.',
                        location: 'Indira Nagar'
                    },
                    email: 'sneha@example.com',
                    phone: '+91 98765 43213'
                },
                {
                    _id: 'dummy5',
                    name: 'Vikram Malhotra',
                    agentProfile: {
                        specialization: 'Industrial',
                        experience: 20,
                        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
                        bio: 'Industrial and warehousing solutions expert.',
                        location: 'Kanpur Road'
                    },
                    email: 'vikram@example.com',
                    phone: '+91 98765 43214'
                }
            ] as any;
        }

        return NextResponse.json({ agents });
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
