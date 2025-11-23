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
                    name: 'Vivid Infra',
                    agentProfile: {
                        specialization: 'Vivid Infra Land Pvt Ltd',
                        experience: 12, // Years in business since 2012
                        photoUrl: '/agent-profile-photo.jpg', // Use local image
                        bio: 'Expert in premium residential properties in Gomti Nagar.',
                        location: 'Gomti Nagar'
                    },
                    email: 'vividinfra@example.com',
                    phone: '+91 98765 43210'
                },
                {
                    _id: 'dummy2',
                    name: 'Saurabh Gupta',
                    agentProfile: {
                        specialization: 'Safe Invest Realty',
                        experience: 12, // Years in business since 2012
                        photoUrl: '/agent-profile.png', // Use local image
                        bio: 'Helping businesses find the perfect office space in Hazratganj.',
                        location: 'Hazratganj'
                    },
                    email: 'saurabh@example.com',
                    phone: '+91 98765 43211'
                },
                {
                    _id: 'dummy3',
                    name: 'Rahul Juyal',
                    agentProfile: {
                        specialization: 'Pratham Realty Solutions',
                        experience: 13, // Years in business since 2011
                        photoUrl: '/agent-photo.jpg', // Use local image
                        bio: 'Specialist in investment plots and land deals across Lucknow.',
                        location: 'Amar Shaheed Path'
                    },
                    email: 'rahul@example.com',
                    phone: '+91 98765 43212'
                },
                {
                    _id: 'dummy4',
                    name: 'Shiyaram Singh',
                    agentProfile: {
                        specialization: 'S.R. Broker LLP',
                        experience: 7, // Years in business since 2017
                        photoUrl: '/agent-profile-photo.jpg', // Use local image (repeated)
                        bio: 'Curating luxury living experiences for discerning clients.',
                        location: 'Indira Nagar'
                    },
                    email: 'shiyaram@example.com',
                    phone: '+91 98765 43213'
                },
                {
                    _id: 'dummy5',
                    name: 'Ankit Sharma',
                    agentProfile: {
                        specialization: 'Property Solutions',
                        experience: 8, // Years of experience
                        photoUrl: '/agent-photo.jpg', // Use local image (repeated)
                        bio: 'Industrial and warehousing solutions expert.',
                        location: 'Kanpur Road'
                    },
                    email: 'ankit@example.com',
                    phone: '+91 98765 43214'
                }
            ] as any;
        }

        // Normalize agent profile image keys so frontend has a consistent `photoUrl`
        const normalized = (agents as any[]).map((a) => {
            if (a.agentProfile) {
                a.agentProfile.photoUrl = a.agentProfile.photoUrl || a.agentProfile.profileImage || a.agentProfile.profileImageUrl;
            }
            return a;
        });

        return NextResponse.json({ agents: normalized });
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
