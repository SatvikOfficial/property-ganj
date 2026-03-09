import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch users with role 'pga' or 'promoter'
        let { data: agents, error } = await supabase
            .from('profiles')
            .select('*')
            .in('role', ['pga', 'promoter']);

        if (error) {
            console.error('Supabase fetch error:', error);
            // Fallback to dummy if error
        }

        // Check if we have agents with valid profile info, otherwise use dummy
        // For the sake of the demo, if we have < 1 agent, we use dummy data
        if (!agents || agents.length === 0) {
            agents = [
                {
                    id: 'dummy1',
                    full_name: 'Vivid Infra',
                    specialization: 'Vivid Infra Land Pvt Ltd',
                    experience: 12,
                    photo_url: '/agent-profile-photo.jpg',
                    bio: 'Expert in premium residential properties in Gomti Nagar.',
                    location: 'Gomti Nagar',
                    email: 'vividinfra@example.com',
                    phone: '+91 98765 43210'
                },
                {
                    id: 'dummy2',
                    full_name: 'Saurabh Gupta',
                    specialization: 'Safe Invest Realty',
                    experience: 12,
                    photo_url: '/agent-profile.png',
                    bio: 'Helping businesses find the perfect office space in Hazratganj.',
                    location: 'Hazratganj',
                    email: 'saurabh@example.com',
                    phone: '+91 98765 43211'
                },
                {
                    id: 'dummy3',
                    full_name: 'Rahul Juyal',
                    specialization: 'Pratham Realty Solutions',
                    experience: 13,
                    photo_url: '/agent-photo.jpg',
                    bio: 'Specialist in investment plots and land deals across Lucknow.',
                    location: 'Amar Shaheed Path',
                    email: 'rahul@example.com',
                    phone: '+91 98765 43212'
                },
                {
                    id: 'dummy4',
                    full_name: 'Shiyaram Singh',
                    specialization: 'S.R. Broker LLP',
                    experience: 7,
                    photo_url: '/agent-profile-photo.jpg',
                    bio: 'Curating luxury living experiences for discerning clients.',
                    location: 'Indira Nagar',
                    email: 'shiyaram@example.com',
                    phone: '+91 98765 43213'
                }
            ] as any[];
        }

        // Normalize agent profile image keys for frontend
        const normalized = agents.map((a) => ({
            _id: a.id,
            name: a.full_name || a.email?.split('@')[0] || 'Agent',
            agentProfile: {
                specialization: a.specialization || 'Real Estate Agent',
                experience: a.experience || 1,
                photoUrl: a.photo_url || '/placeholder.svg',
                bio: a.bio || '',
                location: a.location || 'Lucknow'
            },
            email: a.email,
            phone: a.phone
        }));

        return NextResponse.json({ agents: normalized });
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
