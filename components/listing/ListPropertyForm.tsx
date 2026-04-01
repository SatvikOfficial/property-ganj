'use client';

import type { BuilderListingInput, DbPropertyRecord, OwnerType } from '@/lib/property-listing';
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
  defaultOwnerType?: OwnerType;
  lockOwnerType?: boolean;
  showBuilderFields?: boolean;
  builderDefaults?: BuilderListingInput;
}

export default function ListPropertyForm({
  user,
  mode = 'public',
  initialProperty,
  defaultSubdivision,
  onSuccess,
  submitLabel,
  defaultOwnerType,
  lockOwnerType,
  showBuilderFields,
  builderDefaults,
}: ListPropertyFormProps) {
  return (
    <PropertyListingComposer
      user={user}
      mode={mode}
      initialProperty={initialProperty}
      defaultSubdivision={defaultSubdivision}
      onSuccess={onSuccess}
      submitLabel={submitLabel}
      defaultOwnerType={defaultOwnerType}
      lockOwnerType={lockOwnerType}
      showBuilderFields={showBuilderFields}
      builderDefaults={builderDefaults}
    />
  );
}
