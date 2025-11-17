import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import Header from '@/components/header';
import connectDB from '@/lib/db';
import Property from '@/models/Property';
import User from '@/models/User';
import { PropertyDetailClient } from '@/components/property/PropertyDetailClient';
import { verifyAuthToken } from '@/lib/auth';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  const propertyDoc = await Property.findById(id).lean();

  if (!propertyDoc) {
    notFound();
  }

  const similarDocs = await Property.find({
    _id: { $ne: propertyDoc._id },
    purpose: propertyDoc.purpose,
    propertyType: propertyDoc.propertyType,
    status: 'published',
  })
    .limit(4)
    .lean();

  const property = {
    id: propertyDoc._id.toString(),
    title: propertyDoc.title,
    description: propertyDoc.description,
    price: propertyDoc.price,
    currency: propertyDoc.currency,
    purpose: propertyDoc.purpose,
    propertyType: propertyDoc.propertyType,
    location: {
      city: propertyDoc.location?.city,
      locality: propertyDoc.location?.locality,
      address: propertyDoc.location?.address,
    },
    specs: propertyDoc.specs || {},
    amenities: propertyDoc.amenities || [],
    highlights: propertyDoc.highlights || [],
    media: {
      photos: propertyDoc.media?.photos || [],
      videoUrl: propertyDoc.media?.videoUrl,
    },
    contact: propertyDoc.contact,
  };

  const similar = similarDocs.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    location: [item.location?.locality, item.location?.city].filter(Boolean).join(', '),
    price: item.price,
    area: item.specs?.carpetArea
      ? `${item.specs.carpetArea} ${item.specs?.areaUnit || 'sqft'}`
      : undefined,
    image: item.media?.photos?.[0]?.url,
  }));

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = verifyAuthToken(token);
  let isLiked = false;
  if (payload) {
    const user = await User.findById(payload.userId).lean();
    if (user) {
      isLiked = user.likedProperties.some((id) => id.toString() === property.id);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PropertyDetailClient property={property} similar={similar} initialLiked={isLiked} />
      <footer className="bg-primary text-primary-foreground py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2025 MagicBricks. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
