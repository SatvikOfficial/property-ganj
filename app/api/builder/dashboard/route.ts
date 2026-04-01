import { NextResponse } from 'next/server';

import {
  extractInterestLeadsFromProperty,
  extractListingMetadataFromProperty,
  mapDbPropertyForDetail,
  type DbPropertyRecord,
} from '@/lib/property-listing';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

function isHoldActive(property: Pick<DbPropertyRecord, 'hold_by_user_id' | 'hold_expires_at'>) {
  if (!property.hold_by_user_id || !property.hold_expires_at) return false;
  const expiresAt = new Date(property.hold_expires_at).getTime();
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function isSameMonth(dateString?: string | null) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, phone, email, avatar_url')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'builder') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: properties, error } = await admin
    .from('properties')
    .select('*, property_images(*), property_floorplans(*)')
    .eq('owner_user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ownedProperties = (properties || []) as DbPropertyRecord[];
  const activeHoldUserIds = Array.from(
    new Set(
      ownedProperties
        .filter((property) => isHoldActive(property))
        .map((property) => property.hold_by_user_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const holdProfiles = activeHoldUserIds.length > 0
    ? await admin
        .from('profiles')
        .select('user_id, full_name, phone, role')
        .in('user_id', activeHoldUserIds)
    : { data: [], error: null };

  if (holdProfiles.error) {
    return NextResponse.json({ error: holdProfiles.error.message }, { status: 500 });
  }

  const holdProfileMap = new Map(
    (holdProfiles.data || []).map((item) => [item.user_id, item]),
  );

  const inventory = ownedProperties.map((property) => {
    const mapped = mapDbPropertyForDetail(property, null);
    const { metadata } = extractListingMetadataFromProperty(property);
    const holdActive = isHoldActive(property);
    const holdProfile = property.hold_by_user_id ? holdProfileMap.get(property.hold_by_user_id) : null;
    const status =
      property.status === 'sold'
        ? 'Sold'
        : holdActive
          ? 'On Hold'
          : property.status === 'draft'
            ? 'Draft'
            : 'Available';

    return {
      id: property.id,
      title: property.title,
      unitId: mapped.listingId,
      projectName: metadata.builder?.projectName || property.title || 'Untitled Project',
      unitLabel: metadata.builder?.unitLabel || null,
      tower: metadata.builder?.tower || null,
      floorType: metadata.builder?.floorLabel || mapped.propertyType,
      area: mapped.specs.carpetArea || mapped.specs.builtUpArea || mapped.specs.plotArea || null,
      areaUnit: mapped.specs.areaUnit || 'sqft',
      price: mapped.price || null,
      status,
      imageUrl: mapped.media.photos[0]?.url || null,
      hold: {
        active: holdActive,
        byUserId: property.hold_by_user_id || null,
        byName: holdProfile?.full_name || null,
        byPhone: holdProfile?.phone || null,
        byRole: holdProfile?.role || null,
        expiresAt: property.hold_expires_at || null,
      },
      createdAt: property.created_at || null,
      updatedAt: property.updated_at || null,
    };
  });

  const totalUnits = inventory.length;
  const availableUnits = inventory.filter((item) => item.status === 'Available' || item.status === 'Draft').length;
  const onHoldUnits = inventory.filter((item) => item.status === 'On Hold').length;
  const soldUnits = inventory.filter((item) => item.status === 'Sold').length;
  const soldThisMonth = inventory.filter((item) => item.status === 'Sold' && isSameMonth(item.updatedAt)).length;

  const projectsMap = new Map<string, {
    name: string;
    totalUnits: number;
    availableUnits: number;
    onHoldUnits: number;
    soldUnits: number;
    totalValue: number;
    latestUpdatedAt: string | null;
    coverImage: string | null;
  }>();

  for (const item of inventory) {
    const existing = projectsMap.get(item.projectName) || {
      name: item.projectName,
      totalUnits: 0,
      availableUnits: 0,
      onHoldUnits: 0,
      soldUnits: 0,
      totalValue: 0,
      latestUpdatedAt: item.updatedAt,
      coverImage: item.imageUrl,
    };

    existing.totalUnits += 1;
    if (item.status === 'Available' || item.status === 'Draft') existing.availableUnits += 1;
    if (item.status === 'On Hold') existing.onHoldUnits += 1;
    if (item.status === 'Sold') existing.soldUnits += 1;
    existing.totalValue += item.price || 0;
    if (!existing.coverImage && item.imageUrl) existing.coverImage = item.imageUrl;
    if ((item.updatedAt || '') > (existing.latestUpdatedAt || '')) existing.latestUpdatedAt = item.updatedAt;

    projectsMap.set(item.projectName, existing);
  }

  const projects = Array.from(projectsMap.values()).sort(
    (left, right) => right.totalUnits - left.totalUnits || left.name.localeCompare(right.name),
  );

  const leads = ownedProperties
    .flatMap((property) => {
      const { metadata } = extractListingMetadataFromProperty(property);
      const projectName = metadata.builder?.projectName || property.title || 'Untitled Project';
      const unitLabel = metadata.builder?.unitLabel || null;
      const holdProfile = property.hold_by_user_id ? holdProfileMap.get(property.hold_by_user_id) : null;

      return extractInterestLeadsFromProperty(property).map((lead) => ({
        ...lead,
        projectName,
        unitId: unitLabel || property.pg_id || property.id,
        assignedAgentName: holdProfile?.full_name || null,
      }));
    })
    .sort(
      (left, right) =>
        new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime(),
    );

  const reports = {
    liveInventoryValue: inventory
      .filter((item) => item.status !== 'Sold')
      .reduce((sum, item) => sum + (item.price || 0), 0),
    soldInventoryValueThisMonth: inventory
      .filter((item) => item.status === 'Sold' && isSameMonth(item.updatedAt))
      .reduce((sum, item) => sum + (item.price || 0), 0),
    averageTicketSize: totalUnits > 0
      ? Math.round(inventory.reduce((sum, item) => sum + (item.price || 0), 0) / totalUnits)
      : 0,
    averageArea: totalUnits > 0
      ? Math.round(
          inventory.reduce((sum, item) => sum + (item.area || 0), 0) /
            Math.max(1, inventory.filter((item) => item.area).length),
        )
      : 0,
    activeProjects: projects.length,
    totalLeads: leads.length,
    soldUnits,
  };

  return NextResponse.json({
    builder: {
      id: user.id,
      name: profile.full_name || user.user_metadata?.full_name || user.email || 'Builder',
      phone: profile.phone || '',
      email: profile.email || user.email || '',
      avatarUrl: profile.avatar_url || null,
    },
    stats: {
      totalUnits,
      availableUnits,
      onHoldUnits,
      soldUnits,
      soldThisMonth,
    },
    projects,
    inventory,
    holds: inventory.filter((item) => item.hold.active),
    leads,
    reports,
    properties: ownedProperties,
  });
}
