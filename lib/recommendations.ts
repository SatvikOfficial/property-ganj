'use server';

import connectDB from '@/lib/db';
import Property, { IProperty } from '@/models/Property';

import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/auth';

export async function getRecommendedProperties(limit: number = 6, excludeIds: string[] = []): Promise<IProperty[]> {
    await connectDB();

    try {
        let userId: string | null = null;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (token) {
            const payload = verifyAuthToken(token);
            if (payload) {
                userId = payload.userId;
            }
        }

        let recommended: IProperty[] = [];
        const popularLocalities = ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj'];

        // 1. If user is logged in, try to get recommendations based on liked properties
        if (userId) {
            const User = (await import('@/models/User')).default;
            const user = await User.findById(userId).populate('likedProperties');

            if (user && user.likedProperties && user.likedProperties.length > 0) {
                // Extract preferences from liked properties
                const liked = user.likedProperties as unknown as IProperty[];
                const localities = [...new Set(liked.map(p => p.location?.locality).filter(Boolean))];
                const types = [...new Set(liked.map(p => p.propertyType))];
                const purposes = [...new Set(liked.map(p => p.purpose))];

                // Find similar properties (excluding already liked ones)
                recommended = await Property.find({
                    _id: { $nin: liked.map(p => p._id) },
                    status: 'published',
                    $or: [
                        { 'location.locality': { $in: localities } },
                        { propertyType: { $in: types } },
                        { purpose: { $in: purposes } }
                    ]
                })
                    .limit(6)
                    .sort({ createdAt: -1 })
                    .lean();
            }
        }

        // 2. If no personal recommendations found (or user not logged in), fall back to popular localities
        if (recommended.length === 0) {
            recommended = await Property.find({
                'location.locality': { $in: popularLocalities },
                status: 'published'
            })
                .limit(6)
                .sort({ createdAt: -1 })
                .lean();
        }

        // 3. If still not enough, just get any published properties
        if (recommended.length < 3) {
            const existingIds = recommended.map(p => p._id);
            const fallback = await Property.find({
                status: 'published',
                _id: { $nin: existingIds }
            })
                .limit(6 - recommended.length)
                .sort({ createdAt: -1 })
                .lean();

            recommended = [...recommended, ...fallback];
        }

        return JSON.parse(JSON.stringify(recommended));
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}
