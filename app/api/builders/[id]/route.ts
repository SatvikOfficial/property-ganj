import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Builder from '@/models/Builder';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const builder = await Builder.findById(params.id);
        if (!builder) {
            return NextResponse.json(
                { error: 'Builder not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(builder);
    } catch (error) {
        console.error('Error fetching builder:', error);
        return NextResponse.json(
            { error: 'Failed to fetch builder' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await request.json();
        const builder = await Builder.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!builder) {
            return NextResponse.json(
                { error: 'Builder not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(builder);
    } catch (error) {
        console.error('Error updating builder:', error);
        return NextResponse.json(
            { error: 'Failed to update builder' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const builder = await Builder.findByIdAndDelete(params.id);
        if (!builder) {
            return NextResponse.json(
                { error: 'Builder not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ message: 'Builder deleted successfully' });
    } catch (error) {
        console.error('Error deleting builder:', error);
        return NextResponse.json(
            { error: 'Failed to delete builder' },
            { status: 500 }
        );
    }
}
