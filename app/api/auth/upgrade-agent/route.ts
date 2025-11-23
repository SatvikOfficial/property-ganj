import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        const payload = verifyAuthToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { agentProfile } = body;

        if (!agentProfile) {
            return NextResponse.json(
                { error: 'Agent profile data is required' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            payload.userId,
            {
                role: 'agent',
                agentProfile: agentProfile,
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Upgraded to agent successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error upgrading to agent:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
