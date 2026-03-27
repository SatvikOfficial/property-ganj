import { notFound } from 'next/navigation';

import Header from '@/components/header';
import { PropertyDetailClient } from '@/components/property/PropertyDetailClient';
import { hasPropertyInterestFromUser, mapDbPropertyForDetail } from '@/lib/property-listing';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

type ViewerProfile = {
  isAuthenticated: boolean;
  name?: string;
  phone?: string;
  email?: string;
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: propertyRecord, error } = await admin
    .from('properties')
    .select('*, property_images(*), property_floorplans(*)')
    .eq('id', id)
    .maybeSingle();

  if (error || !propertyRecord || propertyRecord.status === 'draft') {
    notFound();
  }

  let ownerProfile: { full_name?: string | null; role?: string | null; phone?: string | null; email?: string | null } | null = null;
  if (propertyRecord.owner_user_id) {
    const { data } = await admin
      .from('profiles')
      .select('full_name, role, phone, email')
      .eq('user_id', propertyRecord.owner_user_id)
      .maybeSingle();
    ownerProfile = data;
  }

  const property = mapDbPropertyForDetail(propertyRecord as any, ownerProfile);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialInterest = false;
  let initialSaved = false;
  let viewer: ViewerProfile = { isAuthenticated: false };

  if (user) {
    const [{ data: liked }, { data: profile }] = await Promise.all([
      admin
        .from('likes')
        .select('id')
        .eq('property_id', id)
        .eq('user_id', user.id)
        .maybeSingle(),
      admin
        .from('profiles')
        .select('full_name, phone, email')
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);

    initialSaved = Boolean(liked);
    initialInterest = hasPropertyInterestFromUser(propertyRecord as any, user.id);
    viewer = {
      isAuthenticated: true,
      name: profile?.full_name || user.user_metadata?.full_name || undefined,
      phone: profile?.phone || undefined,
      email: profile?.email || user.email || undefined,
    };
  }

  const similarBaseQuery = admin
    .from('properties')
    .select('*, property_images(*)')
    .neq('id', id)
    .neq('status', 'draft')
    .limit(6)
    .order('created_at', { ascending: false });

  const localityQuery = propertyRecord.locality
    ? similarBaseQuery.eq('locality', propertyRecord.locality)
    : propertyRecord.city
      ? similarBaseQuery.eq('city', propertyRecord.city)
      : similarBaseQuery;

  const { data: primarySimilar } = await localityQuery;
  const fallbackIds = new Set((primarySimilar || []).map((item) => item.id));

  let similarRecords = primarySimilar || [];
  if (similarRecords.length < 4) {
    const { data: secondarySimilar } = await admin
      .from('properties')
      .select('*, property_images(*)')
      .neq('id', id)
      .neq('status', 'draft')
      .limit(8)
      .order('created_at', { ascending: false });

    for (const candidate of secondarySimilar || []) {
      if (!fallbackIds.has(candidate.id)) {
        similarRecords.push(candidate);
        fallbackIds.add(candidate.id);
      }
      if (similarRecords.length >= 4) break;
    }
  }

  const similar = similarRecords.slice(0, 4).map((item) => {
    const mapped = mapDbPropertyForDetail(item as any, null);
    return {
      id: mapped.id,
      title: mapped.title,
      location: [mapped.location.locality, mapped.location.city].filter(Boolean).join(', '),
      price: mapped.price,
      area: mapped.specs.carpetArea
        ? `${mapped.specs.carpetArea} ${mapped.specs.areaUnit || 'sqft'}`
        : mapped.specs.plotArea
          ? `${mapped.specs.plotArea} ${mapped.specs.areaUnit || 'sqft'}`
          : undefined,
      image: mapped.media.photos[0]?.url,
      purpose: mapped.purpose,
      propertyType: mapped.propertyType,
    };
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PropertyDetailClient
        property={property}
        similar={similar}
        initialSaved={initialSaved}
        initialInterest={initialInterest}
        viewer={viewer}
      />
    </main>
  );
}
