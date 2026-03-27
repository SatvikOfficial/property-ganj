'use client';

import type { DbPropertyRecord } from '@/lib/property-listing';
import type { PropertyGanjSubdivision } from '@/lib/property-ganj';
import PropertyListingComposer from '@/components/listing/PropertyListingComposer';

type UserProfile = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
};

interface ListPropertyFormProps {
  user: UserProfile | null;
  mode?: 'public' | 'admin';
  initialProperty?: DbPropertyRecord | null;
  defaultSubdivision?: PropertyGanjSubdivision;
  onSuccess?: (property: any) => void;
  submitLabel?: string;
}

export default function ListPropertyForm({
  user,
  mode = 'public',
  initialProperty,
  defaultSubdivision,
  onSuccess,
  submitLabel,
}: ListPropertyFormProps) {
  return (
    <PropertyListingComposer
      user={user}
      mode={mode}
      initialProperty={initialProperty}
      defaultSubdivision={defaultSubdivision}
      onSuccess={onSuccess}
      submitLabel={submitLabel}
    />
  );
}

