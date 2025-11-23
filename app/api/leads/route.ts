import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, phone, email, type, targetId, targetName } = body;

        if (!name || !phone || !type || !targetId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const lead = await Lead.create({
            name,
            phone,
            email,
            type,
            targetId,
            targetName,
        });

        return NextResponse.json(
            { message: 'Inquiry submitted successfully', lead },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error submitting lead:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
