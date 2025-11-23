import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Builder from '@/models/Builder';

export async function GET() {
    try {
        await connectDB();
        const builders = await Builder.find({}).sort({ createdAt: -1 });
        return NextResponse.json(builders);
    } catch (error) {
        console.error('Error fetching builders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch builders' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const builder = await Builder.create(body);
        return NextResponse.json(builder, { status: 201 });
    } catch (error) {
        console.error('Error creating builder:', error);
        return NextResponse.json(
            { error: 'Failed to create builder' },
            { status: 500 }
        );
    }
}
