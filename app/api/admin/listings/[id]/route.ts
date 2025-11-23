import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/models/Property';
import { verifyAuthToken } from '@/lib/auth';
import User from '@/models/User';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        const payload = verifyAuthToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(payload.userId);

        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const listing = await Property.findByIdAndDelete(params.id);

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
