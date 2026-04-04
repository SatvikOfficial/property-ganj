'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Compass,
  ImagePlus,
  IndianRupee,
  Layers3,
  MapPin,
  PhoneCall,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';

import LucknowLocationAutocomplete, {
  type ResolvedLucknowLocation,
} from '@/components/location/LucknowLocationAutocomplete';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AMENITY_OPTIONS,
  AREA_UNIT_OPTIONS,
  type BuilderListingInput,
  OWNER_TYPE_OPTIONS,
  PHOTO_CATEGORIES,
  PROPERTY_TYPE_OPTIONS,
  FACING_OPTIONS,
  PURPOSE_OPTIONS,
  TAG_OPTIONS,
  buildPublicStorageUrl,
  extractListingMetadataFromProperty,
  parseImageDescription,
  type DbPropertyRecord,
  type ListingPurpose,
  type OwnerType,
  type PhotoCategory,
  type UploadedListingFloorplan,
  type UploadedListingMedia,
} from '@/lib/property-listing';
import {
  PROPERTY_GANJ_DEFAULT_SUBDIVISION,
  PROPERTY_GANJ_SUBDIVISIONS,
  type PropertyGanjSubdivision,
  getPropertyGanjSubdivisionMeta,
} from '@/lib/property-ganj';
import { cn, normalizeYouTubeUrl } from '@/lib/utils';

type UserProfile = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
};

type ListingComposerProps = {
  mode?: 'public' | 'admin';
  user: UserProfile | null;
  initialProperty?: DbPropertyRecord | null;
  defaultSubdivision?: PropertyGanjSubdivision;
  onSuccess?: (property: any) => void;
  submitLabel?: string;
  defaultOwnerType?: OwnerType;
  lockOwnerType?: boolean;
  showBuilderFields?: boolean;
  builderDefaults?: BuilderListingInput;
};

type FormState = {
  ownerType: OwnerType;
  purpose: ListingPurpose;
  propertyType: string;
  title: string;
  description: string;
  price: string;
  maintenance: string;
  deposit: string;
  bookingAmount: string;
  location: {
    city: string;
    locality: string;
    area: string;
    sector: string;
    block: string;
    road: string;
    address: string;
    pincode: string;
    landmark: string;
    latitude: string;
    longitude: string;
    placeId: string;
    geoSource: 'geoapify' | 'manual';
  };
  specs: {
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    carpetArea: string;
    builtUpArea: string;
    plotArea: string;
    areaUnit: string;
    floorNo: string;
    totalFloors: string;
    furnishing: string;
    age: string;
    facing: string;
    parking: string;
    possessionStatus: string;
    availableFrom: string;
    noOfOpenSides: string;
    widthOfRoadFacing: string;
    anyConstructionDone: 'Yes' | 'No';
    boundaryWallMade: 'Yes' | 'No';
    isInGatedColony: 'Yes' | 'No';
    isCornerPlot: 'Yes' | 'No';
    floorsAllowedForConstruction: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  builder: {
    projectName: string;
    unitLabel: string;
    tower: string;
    floorLabel: string;
  };
  highlights: string[];
  amenities: string[];
  tags: string[];
  videoUrl: string;
  subdivision: PropertyGanjSubdivision;
};

function createEmptyPhotoState() {
  return PHOTO_CATEGORIES.reduce<Record<PhotoCategory, UploadedListingMedia[]>>((acc, category) => {
    acc[category.id] = [];
    return acc;
  }, {} as Record<PhotoCategory, UploadedListingMedia[]>);
}

function parseNumber(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function stringifyNumber(value?: number | null) {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
}

function boolToYesNo(value?: boolean) {
  return value ? 'Yes' : 'No';
}

function yesNoToBool(value: 'Yes' | 'No') {
  return value === 'Yes';
}

function dbTypeToFormType(value?: string | null) {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('land')) return 'Plot/Land';
  if (normalized.includes('house') || normalized.includes('villa')) return 'Independent House/Villa';
  if (normalized.includes('office')) return 'Office Space';
  if (normalized.includes('shop') || normalized.includes('retail')) return 'Retail/Shop';
  if (normalized.includes('warehouse')) return 'Warehouse';
  if (normalized.includes('industrial')) return 'Industrial';
  if (normalized.includes('studio')) return 'Studio';
  return 'Apartment';
}

function buildInitialState(
  user: UserProfile | null,
  defaultSubdivision: PropertyGanjSubdivision,
  defaultOwnerType: OwnerType,
  builderDefaults?: BuilderListingInput,
  initialProperty?: DbPropertyRecord | null,
): { form: FormState; photos: Record<PhotoCategory, UploadedListingMedia[]>; floorplans: UploadedListingFloorplan[] } {
  if (!initialProperty) {
    return {
      form: {
        ownerType: defaultOwnerType,
        purpose: 'sale',
        propertyType: 'Apartment',
        title: '',
        description: '',
        price: '',
        maintenance: '',
        deposit: '',
        bookingAmount: '',
        location: {
          city: 'Lucknow',
          locality: '',
          area: '',
          sector: '',
          block: '',
          road: '',
          address: '',
          pincode: '',
          landmark: '',
          latitude: '',
          longitude: '',
          placeId: '',
          geoSource: 'manual',
        },
        specs: {
          bedrooms: '',
          bathrooms: '',
          balconies: '',
          carpetArea: '',
          builtUpArea: '',
          plotArea: '',
          areaUnit: 'sqft',
          floorNo: '',
          totalFloors: '',
          furnishing: '',
          age: '',
          facing: '',
          parking: '',
          possessionStatus: '',
          availableFrom: '',
          noOfOpenSides: '',
          widthOfRoadFacing: '',
          anyConstructionDone: 'No',
          boundaryWallMade: 'No',
          isInGatedColony: 'No',
          isCornerPlot: 'No',
          floorsAllowedForConstruction: '',
        },
        contact: {
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
        },
        builder: {
          projectName: builderDefaults?.projectName || '',
          unitLabel: builderDefaults?.unitLabel || '',
          tower: builderDefaults?.tower || '',
          floorLabel: builderDefaults?.floorLabel || '',
        },
        highlights: [''],
        amenities: [],
        tags: [],
        videoUrl: '',
        subdivision: defaultSubdivision,
      },
      photos: createEmptyPhotoState(),
      floorplans: [],
    };
  }

  const { description, metadata } = extractListingMetadataFromProperty(initialProperty);
  const photos = createEmptyPhotoState();

  (initialProperty.property_images || []).forEach((image, index) => {
    const imageMeta = parseImageDescription(image.description);
    const category = imageMeta.category || 'other';
    photos[category].push({
      bucket: image.bucket,
      path: image.path,
      url: buildPublicStorageUrl(image.bucket, image.path),
      category,
      label: imageMeta.label || undefined,
      sortOrder: image.sort_order ?? index,
      isPrimary: image.is_primary ?? index === 0,
    });
  });

  const floorplans = (initialProperty.property_floorplans || []).map((plan, index) => ({
    bucket: plan.bucket,
    path: plan.path,
    url: buildPublicStorageUrl(plan.bucket, plan.path),
    label: plan.label || `Floor plan ${index + 1}`,
    sortOrder: plan.sort_order ?? index,
  }));

  return {
    form: {
      ownerType: metadata.ownerType || defaultOwnerType,
      purpose: initialProperty.for_rent ? 'rent' : 'sale',
      propertyType: dbTypeToFormType(initialProperty.property_type),
      title: initialProperty.title,
      description,
      price: stringifyNumber(initialProperty.for_rent ? initialProperty.rent : initialProperty.price),
      maintenance: stringifyNumber(initialProperty.maintenance),
      deposit: stringifyNumber(initialProperty.deposit),
      bookingAmount: stringifyNumber(metadata.pricing?.bookingAmount),
      location: {
        city: initialProperty.city || 'Lucknow',
        locality: initialProperty.locality || '',
        area: metadata.location?.area || '',
        sector: metadata.location?.sector || '',
        block: metadata.location?.block || '',
        road: metadata.location?.road || '',
        address: initialProperty.address_line1 || '',
        pincode: initialProperty.postal_code || metadata.location?.pincode || '',
        landmark: metadata.location?.landmark || '',
        latitude: stringifyNumber(initialProperty.lat ?? metadata.location?.latitude),
        longitude: stringifyNumber(initialProperty.lng ?? metadata.location?.longitude),
        placeId: metadata.location?.placeId || initialProperty.place_id || '',
        geoSource: metadata.location?.geoSource || 'manual',
      },
      specs: {
        bedrooms: stringifyNumber(initialProperty.bedrooms),
        bathrooms: stringifyNumber(initialProperty.bathrooms),
        balconies: stringifyNumber(metadata.specs?.balconies),
        carpetArea: stringifyNumber(initialProperty.carpet_area_sqft),
        builtUpArea: stringifyNumber(initialProperty.built_up_area_sqft),
        plotArea: stringifyNumber(metadata.specs?.plotArea),
        areaUnit: metadata.specs?.areaUnit || 'sqft',
        floorNo: stringifyNumber(metadata.specs?.floorNo),
        totalFloors: stringifyNumber(metadata.specs?.totalFloors),
        furnishing: initialProperty.furnishing || '',
        age: metadata.specs?.age || '',
        facing: metadata.specs?.facing || '',
        parking: stringifyNumber(initialProperty.parking),
        possessionStatus: metadata.specs?.possessionStatus || '',
        availableFrom: metadata.specs?.availableFrom || '',
        noOfOpenSides: stringifyNumber(metadata.specs?.noOfOpenSides),
        widthOfRoadFacing: stringifyNumber(metadata.specs?.widthOfRoadFacing),
        anyConstructionDone: boolToYesNo(metadata.specs?.anyConstructionDone),
        boundaryWallMade: boolToYesNo(metadata.specs?.boundaryWallMade),
        isInGatedColony: boolToYesNo(metadata.specs?.isInGatedColony),
        isCornerPlot: boolToYesNo(metadata.specs?.isCornerPlot),
        floorsAllowedForConstruction: stringifyNumber(metadata.specs?.floorsAllowedForConstruction),
      },
      contact: {
        name: metadata.contact?.name || user?.name || '',
        phone: metadata.contact?.phone || user?.phone || '',
        email: metadata.contact?.email || user?.email || '',
      },
      builder: {
        projectName: metadata.builder?.projectName || builderDefaults?.projectName || '',
        unitLabel: metadata.builder?.unitLabel || builderDefaults?.unitLabel || '',
        tower: metadata.builder?.tower || builderDefaults?.tower || '',
        floorLabel: metadata.builder?.floorLabel || builderDefaults?.floorLabel || '',
      },
      highlights: metadata.features?.highlights?.length ? metadata.features.highlights : [''],
      amenities: metadata.features?.amenities || [],
      tags: metadata.features?.tags || [],
      videoUrl: metadata.media?.videoUrl || '',
      subdivision: metadata.marketing?.subdivision || defaultSubdivision,
    },
    photos,
    floorplans,
  };
}

function Section({
  step,
  icon: Icon,
  title,
  description,
  children,
}: {
  step: string;
  icon: any;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-[#eadcca] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,241,0.88))] p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.32)] md:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#9ca3af]">{step}</p>
      <div className="mt-3 flex items-start gap-4">
        <div className="rounded-2xl bg-[#fff1ea] p-3 text-[#eb6239]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#1f2a2e]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function UploadTile({
  label,
  helper,
  count,
  accept,
  onFilesSelected,
  uploading,
}: {
  label: string;
  helper: string;
  count: number;
  accept?: string;
  onFilesSelected: (files: FileList) => void;
  uploading: boolean;
}) {
  return (
    <label className="group flex cursor-pointer flex-col gap-3 rounded-[24px] border border-dashed border-[#d6c4b0] bg-white/80 p-4 transition hover:border-[#eb6239] hover:bg-[#fff8f3]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[#1f2a2e]">{label}</p>
          <p className="mt-1 text-xs leading-5 text-[#7a8793]">{helper}</p>
        </div>
        <span className="rounded-full bg-[#f6f0ea] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b7280]">
          {uploading ? 'Uploading' : `${count} files`}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-[#1f2a2e] px-4 py-3 text-sm font-bold text-white transition group-hover:bg-[#2d3c40]">
        <UploadCloud className="h-4 w-4" />
        Add media
      </div>
      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple
        onChange={(event) => {
          if (event.target.files?.length) onFilesSelected(event.target.files);
          event.currentTarget.value = '';
        }}
      />
    </label>
  );
}

export default function PropertyListingComposer({
  mode = 'public',
  user,
  initialProperty,
  defaultSubdivision = PROPERTY_GANJ_DEFAULT_SUBDIVISION,
  onSuccess,
  submitLabel,
  defaultOwnerType = mode === 'admin' ? 'builder' : 'owner',
  lockOwnerType = false,
  showBuilderFields = false,
  builderDefaults,
}: ListingComposerProps) {
  const router = useRouter();
  const { toast } = useToast();

  const initialState = useMemo(
    () => buildInitialState(user, defaultSubdivision, defaultOwnerType, builderDefaults, initialProperty),
    [builderDefaults, defaultOwnerType, defaultSubdivision, initialProperty, user],
  );

  const [form, setForm] = useState<FormState>(initialState.form);
  const [photos, setPhotos] = useState<Record<PhotoCategory, UploadedListingMedia[]>>(initialState.photos);
  const [floorplans, setFloorplans] = useState<UploadedListingFloorplan[]>(initialState.floorplans);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locationQuery, setLocationQuery] = useState(initialState.form.location.locality);

  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(form) !== JSON.stringify(initialState.form) ||
      JSON.stringify(photos) !== JSON.stringify(initialState.photos) ||
      JSON.stringify(floorplans) !== JSON.stringify(initialState.floorplans)
    );
  }, [form, photos, floorplans, initialState]);

  useEffect(() => {
    const handleNavigationCapture = (e: MouseEvent) => {
      if (!isDirty || submitting) return;

      const target = e.target as Element;
      const formEl = target.closest('form');
      const flexLink = target.closest('a');
      const flexBtn = target.closest('button');

      const isExternalLink = flexLink && !formEl?.contains(flexLink);
      const isOutsideButton = flexBtn && !formEl?.contains(flexBtn);

      if (isExternalLink) {
        const href = flexLink.getAttribute('href');
        if (href && !href.startsWith('#') && !flexLink.hasAttribute('target')) {
          e.preventDefault();
          e.stopPropagation();
          setPendingAction(() => () => { window.location.href = href; });
          setShowExitWarning(true);
        }
      } else if (isOutsideButton) {
        e.preventDefault();
        e.stopPropagation();
        setPendingAction(() => () => {
          setForm(initialState.form);
          setPhotos(initialState.photos);
          setFloorplans(initialState.floorplans);
        });
        setShowExitWarning(true);
      }
    };

    document.addEventListener('click', handleNavigationCapture, { capture: true });
    return () => document.removeEventListener('click', handleNavigationCapture, { capture: true });
  }, [isDirty, submitting, initialState]);

  useEffect(() => {
    setForm(initialState.form);
    setPhotos(initialState.photos);
    setFloorplans(initialState.floorplans);
    setLocationQuery(initialState.form.location.locality);
  }, [initialState]);

  const isLand = form.propertyType === 'Plot/Land';
  const isBuilderWorkspace = defaultOwnerType === 'builder' && lockOwnerType;
  const shouldShowBuilderFields = showBuilderFields || form.ownerType === 'builder';
  const totalPhotoCount = useMemo(
    () => Object.values(photos).reduce((sum, items) => sum + items.length, 0),
    [photos],
  );

  const primaryPhotoPreview =
    Object.values(photos).flat().sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))[0]?.url ||
    initialProperty?.provider ||
    '/placeholder.svg';

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setBuilderField = <K extends keyof FormState['builder']>(
    name: K,
    value: FormState['builder'][K],
  ) => {
    setForm((prev) => ({
      ...prev,
      builder: { ...prev.builder, [name]: value },
    }));
  };

  const setLocationField = <K extends keyof FormState['location']>(
    name: K,
    value: FormState['location'][K],
  ) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const setSpecsField = <K extends keyof FormState['specs']>(
    name: K,
    value: FormState['specs'][K],
  ) => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, [name]: value },
    }));
  };

  const toggleSelection = (value: string, key: 'amenities' | 'tags') => {
    setForm((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const updateHighlight = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((highlight, highlightIndex) =>
        highlightIndex === index ? value : highlight,
      ),
    }));
  };

  const addHighlight = () => {
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index: number) => {
    setForm((prev) => ({
      ...prev,
      highlights:
        prev.highlights.length === 1
          ? ['']
          : prev.highlights.filter((_, highlightIndex) => highlightIndex !== index),
    }));
  };

  const handleLocationSelect = (resolved: ResolvedLucknowLocation) => {
    setLocationQuery(resolved.label);
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: resolved.city || prev.location.city || 'Lucknow',
        locality: resolved.locality || resolved.area || resolved.label,
        area: resolved.area || prev.location.area,
        sector: resolved.sector || prev.location.sector,
        block: resolved.block || prev.location.block,
        road: resolved.road || prev.location.road,
        address: resolved.formattedAddress || prev.location.address,
        pincode: resolved.pincode || prev.location.pincode,
        latitude: resolved.latitude ? resolved.latitude.toFixed(6) : prev.location.latitude,
        longitude: resolved.longitude ? resolved.longitude.toFixed(6) : prev.location.longitude,
        placeId: resolved.placeId || prev.location.placeId,
        geoSource: 'geoapify',
      },
    }));
  };

  const uploadFiles = async (files: FileList, kind: PhotoCategory | 'floorplan') => {
    setUploadingKey(kind);
    try {
      const uploaded: UploadedListingMedia[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append('file', file);
        body.append('category', kind);

        const response = await fetch('/api/uploads/photos', {
          method: 'POST',
          body,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.error || 'Upload failed');
        }

        uploaded.push({
          bucket: data.bucket,
          path: data.path,
          url: data.url,
          label: file.name.replace(/\.[^.]+$/, ''),
          category: kind === 'floorplan' ? undefined : (kind as PhotoCategory),
        });
      }

      if (kind === 'floorplan') {
        setFloorplans((prev) => [
          ...prev,
          ...uploaded.map((item, index) => ({
            bucket: item.bucket,
            path: item.path,
            url: item.url,
            label: item.label || `Floor plan ${prev.length + index + 1}`,
            sortOrder: prev.length + index,
          })),
        ]);
      } else {
        setPhotos((prev) => ({
          ...prev,
          [kind]: [
            ...prev[kind],
            ...uploaded.map((item, index) => ({
              bucket: item.bucket,
              path: item.path,
              url: item.url,
              category: kind,
              label: item.label,
              sortOrder: prev[kind].length + index,
              isPrimary: Object.values(prev).flat().length === 0 && index === 0,
            })),
          ],
        }));
      }

      toast({
        title: 'Media uploaded',
        description: `${uploaded.length} file${uploaded.length > 1 ? 's' : ''} ready for this listing.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const removePhoto = (category: PhotoCategory, index: number) => {
    setPhotos((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeFloorplan = (index: number) => {
    setFloorplans((prev) => prev.filter((_, planIndex) => planIndex !== index));
  };

  const resetForm = () => {
    const resetState = buildInitialState(user, defaultSubdivision, defaultOwnerType, builderDefaults, null);
    setForm(resetState.form);
    setPhotos(resetState.photos);
    setFloorplans(resetState.floorplans);
    setLocationQuery(resetState.form.location.locality);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Add a strong listing title before publishing.',
        variant: 'destructive',
      });
      return;
    }

    if (!form.location.locality.trim()) {
      toast({
        title: 'Location required',
        description: 'Pick the locality so the listing can be discovered properly.',
        variant: 'destructive',
      });
      return;
    }

    if (!form.price.trim() || Number.isNaN(Number(form.price))) {
      toast({
        title: 'Price required',
        description: 'Enter the expected sale price or monthly rent.',
        variant: 'destructive',
      });
      return;
    }

    if (totalPhotoCount === 0) {
      toast({
        title: 'Add listing media',
        description: 'At least one photo is needed for a polished listing page.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        purpose: form.purpose,
        ownerType: form.ownerType,
        propertyType: form.propertyType,
        price: parseNumber(form.price),
        maintenance: parseNumber(form.maintenance),
        deposit: parseNumber(form.deposit),
        bookingAmount: parseNumber(form.bookingAmount),
        location: {
          city: form.location.city.trim() || 'Lucknow',
          locality: form.location.locality.trim(),
          area: form.location.area.trim() || undefined,
          sector: form.location.sector.trim() || undefined,
          block: form.location.block.trim() || undefined,
          road: form.location.road.trim() || undefined,
          address: form.location.address.trim() || undefined,
          pincode: form.location.pincode.trim() || undefined,
          landmark: form.location.landmark.trim() || undefined,
          latitude: parseNumber(form.location.latitude),
          longitude: parseNumber(form.location.longitude),
          placeId: form.location.placeId.trim() || undefined,
          geoSource: form.location.geoSource,
        },
        specs: {
          bedrooms: parseNumber(form.specs.bedrooms),
          bathrooms: parseNumber(form.specs.bathrooms),
          balconies: parseNumber(form.specs.balconies),
          carpetArea: parseNumber(form.specs.carpetArea),
          builtUpArea: parseNumber(form.specs.builtUpArea),
          plotArea: parseNumber(form.specs.plotArea),
          areaUnit: form.specs.areaUnit,
          floorNo: parseNumber(form.specs.floorNo),
          totalFloors: parseNumber(form.specs.totalFloors),
          furnishing: form.specs.furnishing.trim() || undefined,
          age: form.specs.age.trim() || undefined,
          facing: form.specs.facing.trim() || undefined,
          parking: parseNumber(form.specs.parking),
          possessionStatus: form.specs.possessionStatus.trim() || undefined,
          availableFrom: form.specs.availableFrom || undefined,
          noOfOpenSides: parseNumber(form.specs.noOfOpenSides),
          widthOfRoadFacing: parseNumber(form.specs.widthOfRoadFacing),
          anyConstructionDone: yesNoToBool(form.specs.anyConstructionDone),
          boundaryWallMade: yesNoToBool(form.specs.boundaryWallMade),
          isInGatedColony: yesNoToBool(form.specs.isInGatedColony),
          isCornerPlot: yesNoToBool(form.specs.isCornerPlot),
          floorsAllowedForConstruction: parseNumber(form.specs.floorsAllowedForConstruction),
        },
        contact: {
          name: form.contact.name.trim() || undefined,
          phone: form.contact.phone.trim() || undefined,
          email: form.contact.email.trim() || undefined,
        },
        builder: shouldShowBuilderFields
          ? {
              projectName: form.builder.projectName.trim() || undefined,
              unitLabel: form.builder.unitLabel.trim() || undefined,
              tower: form.builder.tower.trim() || undefined,
              floorLabel: form.builder.floorLabel.trim() || undefined,
            }
          : undefined,
        highlights: form.highlights.map((highlight) => highlight.trim()).filter(Boolean),
        amenities: form.amenities,
        tags: form.tags,
        videoUrl: normalizeYouTubeUrl(form.videoUrl.trim()) || undefined,
        media: {
          photos: Object.entries(photos)
            .flatMap(([category, items]) =>
              items.map((item, index) => ({
                bucket: item.bucket,
                path: item.path,
                url: item.url,
                category,
                label: item.label,
                sortOrder: item.sortOrder ?? index,
                isPrimary: Boolean(item.isPrimary),
              })),
            )
            .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0)),
          floorplans: floorplans.map((item, index) => ({
            bucket: item.bucket,
            path: item.path,
            url: item.url,
            label: item.label,
            sortOrder: item.sortOrder ?? index,
          })),
        },
        listedByPropertyGanj: mode === 'admin',
        subdivision: mode === 'admin' ? form.subdivision : undefined,
        status: 'published',
      };

      const isEditing = Boolean(initialProperty?.id);
      const endpoint = mode === 'admin'
        ? '/api/admin/properties'
        : isEditing
          ? `/api/properties/${initialProperty?.id}`
          : '/api/properties';
      const method = mode === 'admin'
        ? isEditing ? 'PATCH' : 'POST'
        : isEditing
          ? 'PATCH'
          : 'POST';
      const body =
        method === 'PATCH'
          ? JSON.stringify(mode === 'admin' ? { propertyId: initialProperty?.id, payload } : { payload })
          : JSON.stringify(payload);

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to publish listing');
      }

      toast({
        title: initialProperty ? 'Listing updated' : mode === 'admin' ? 'Listing saved' : 'Listing published',
        description:
          mode === 'admin'
            ? 'Property Ganj inventory has been updated.'
            : initialProperty
              ? 'Your changes are now live on the listing page.'
              : 'Your listing is live and ready to receive interest requests.',
      });

      if (onSuccess) {
        onSuccess?.(data?.property);
      } else if (data?.property?.id) {
        router.push(`/property/${data.property.id}`);
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Unable to save listing',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-[32px] border border-[#eadcca] bg-[linear-gradient(135deg,rgba(255,248,241,0.96),rgba(255,255,255,0.96))] p-6 shadow-[0_32px_100px_-48px_rgba(15,23,42,0.36)] md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.25fr,0.75fr] md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#9ca3af]">
              {mode === 'admin'
                ? 'Property Ganj inventory'
                : isBuilderWorkspace
                  ? 'Builder inventory composer'
                  : 'Property owner intake'}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1f2a2e] md:text-4xl">
              {mode === 'admin'
                ? 'Create a full listing page, not just a tile'
                : isBuilderWorkspace
                  ? 'Launch and manage builder inventory with project-ready unit data'
                  : 'Publish a listing buyers can actually evaluate'}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
              {mode === 'admin'
                ? 'This composer saves the full property story: location detail, specs, pricing terms, media, and internal seller contact. Public pages stay buyer-friendly while Property Ganj keeps the direct seller information private.'
                : isBuilderWorkspace
                  ? 'Create units under named projects, keep inventory structured by tower and floor, and publish detail pages that are ready for callbacks, routing, and sales operations.'
                  : 'Add enough information for a buyer to understand the property without ever needing to call the owner directly. Property Ganj handles the callback and lead routing.'}
            </p>
          </div>
          <div className="rounded-[28px] border border-[#eadcca] bg-white/90 p-4">
            <div className="flex items-center gap-3">
              <img
                src={primaryPhotoPreview}
                alt="Listing preview"
                className="h-20 w-20 rounded-[20px] border border-[#eadcca] object-cover"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9ca3af]">Live preview</p>
                <p className="mt-1 truncate text-lg font-black text-[#1f2a2e]">
                  {form.title || 'Your listing title'}
                </p>
                <p className="truncate text-sm text-[#667085]">
                  {[form.location.locality, form.location.city].filter(Boolean).join(', ') || 'Location details'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Photos', value: totalPhotoCount },
                { label: 'Floorplans', value: floorplans.length },
                { label: 'Highlights', value: form.highlights.filter(Boolean).length },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-[#fff7f1] px-3 py-3">
                  <p className="text-lg font-black text-[#1f2a2e]">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8793]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Section
        step="Step 1"
        icon={Building2}
        title="Listing Identity"
        description="Capture who is listing the property, what kind of inventory it is, and the headline buyers will see first."
      >
        {lockOwnerType ? (
          <div className="rounded-[24px] border border-[#eadcca] bg-white/85 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9ca3af]">Listing owner type</p>
            <p className="mt-2 text-lg font-black text-[#1f2a2e]">
              {OWNER_TYPE_OPTIONS.find((option) => option.id === defaultOwnerType)?.label || 'Builder'}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#667085]">
              This dashboard is locked to builder inventory so units stay grouped under your projects and reports.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {OWNER_TYPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setField('ownerType', option.id)}
                className={cn(
                  'rounded-[24px] border px-4 py-4 text-left transition',
                  form.ownerType === option.id
                    ? 'border-[#eb6239] bg-[#fff3ed] shadow-[0_14px_38px_-28px_rgba(235,98,57,0.7)]'
                    : 'border-[#eadcca] bg-white/85',
                )}
              >
                <p className="font-semibold text-[#1f2a2e]">{option.label}</p>
                <p className="mt-1 text-xs leading-5 text-[#667085]">{option.description}</p>
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {PURPOSE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setField('purpose', option.id)}
              className={cn(
                'rounded-[24px] border px-5 py-4 text-left transition',
                form.purpose === option.id
                  ? 'border-[#1f2a2e] bg-[#1f2a2e] text-white'
                  : 'border-[#eadcca] bg-white/85 text-[#1f2a2e]',
              )}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="mt-1 text-xs leading-5 opacity-80">{option.description}</p>
            </button>
          ))}
        </div>

        {mode === 'admin' && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">
              Property Ganj landing page subdivision
            </label>
            <select
              value={form.subdivision}
              onChange={(event) => setField('subdivision', event.target.value as PropertyGanjSubdivision)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            >
              {PROPERTY_GANJ_SUBDIVISIONS.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-[#667085]">
              {getPropertyGanjSubdivisionMeta(form.subdivision).description}
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Property title</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
              placeholder="Sun-facing 3 BHK near Shaheed Path"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Property type</label>
            <select
              value={form.propertyType}
              onChange={(event) => setField('propertyType', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            >
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {shouldShowBuilderFields ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Project name</label>
              <input
                type="text"
                value={form.builder.projectName}
                onChange={(event) => setBuilderField('projectName', event.target.value)}
                className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                placeholder="E.g. Skyline Residency"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Unit label</label>
              <input
                type="text"
                value={form.builder.unitLabel}
                onChange={(event) => setBuilderField('unitLabel', event.target.value)}
                className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                placeholder="E.g. A-1203"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Tower / block</label>
              <input
                type="text"
                value={form.builder.tower}
                onChange={(event) => setBuilderField('tower', event.target.value)}
                className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                placeholder="Tower A"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Floor label</label>
              <input
                type="text"
                value={form.builder.floorLabel}
                onChange={(event) => setBuilderField('floorLabel', event.target.value)}
                className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                placeholder="12th Floor"
              />
            </div>
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            placeholder="Describe the layout, sunlight, nearby landmarks, project feel, and why this property stands out."
          />
        </div>
      </Section>

      <Section
        step="Step 2"
        icon={MapPin}
        title="Location Depth"
        description="The page should tell buyers exactly where the inventory sits without exposing direct seller contact details."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">City</label>
            <input
              type="text"
              value={form.location.city}
              onChange={(event) => setLocationField('city', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Locality</label>
            <LucknowLocationAutocomplete
              value={locationQuery}
              onChange={(value) => {
                setLocationQuery(value);
                setLocationField('locality', value);
                setLocationField('latitude', '');
                setLocationField('longitude', '');
                setLocationField('placeId', '');
                setLocationField('geoSource', 'manual');
              }}
              onSelect={handleLocationSelect}
              showDetectButton
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Area / zone</label>
            <input
              type="text"
              value={form.location.area}
              onChange={(event) => setLocationField('area', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Sector / block</label>
            <input
              type="text"
              value={form.location.sector}
              onChange={(event) => setLocationField('sector', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
              placeholder="Sector 3, Block C"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Sub-block / colony</label>
            <input
              type="text"
              value={form.location.block}
              onChange={(event) => setLocationField('block', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Primary road</label>
            <input
              type="text"
              value={form.location.road}
              onChange={(event) => setLocationField('road', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
              placeholder="Shaheed Path, Sultanpur Road"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Address line</label>
            <input
              type="text"
              value={form.location.address}
              onChange={(event) => setLocationField('address', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
              placeholder="Tower / house number / street"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Pincode</label>
            <input
              type="text"
              value={form.location.pincode}
              onChange={(event) => setLocationField('pincode', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Landmark</label>
            <input
              type="text"
              value={form.location.landmark}
              onChange={(event) => setLocationField('landmark', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            />
          </div>
        </div>
      </Section>

      <Section
        step="Step 3"
        icon={Compass}
        title="Property Specs"
        description="Capture the practical decision-making data buyers compare across listings."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {!isLand && (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Bedrooms</label>
                <input type="number" value={form.specs.bedrooms} onChange={(event) => setSpecsField('bedrooms', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Bathrooms</label>
                <input type="number" value={form.specs.bathrooms} onChange={(event) => setSpecsField('bathrooms', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Balconies</label>
                <input type="number" value={form.specs.balconies} onChange={(event) => setSpecsField('balconies', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Carpet area</label>
            <input type="number" value={form.specs.carpetArea} onChange={(event) => setSpecsField('carpetArea', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Built-up area</label>
            <input type="number" value={form.specs.builtUpArea} onChange={(event) => setSpecsField('builtUpArea', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Area unit</label>
            <select value={form.specs.areaUnit} onChange={(event) => setSpecsField('areaUnit', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
              {AREA_UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {isLand ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Plot area</label>
                <input type="number" value={form.specs.plotArea} onChange={(event) => setSpecsField('plotArea', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Open sides</label>
                <input type="number" value={form.specs.noOfOpenSides} onChange={(event) => setSpecsField('noOfOpenSides', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Road width facing (m)</label>
                <input type="number" value={form.specs.widthOfRoadFacing} onChange={(event) => setSpecsField('widthOfRoadFacing', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Construction done?</label>
                <select value={form.specs.anyConstructionDone} onChange={(event) => setSpecsField('anyConstructionDone', event.target.value as 'Yes' | 'No')} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Boundary wall</label>
                <select value={form.specs.boundaryWallMade} onChange={(event) => setSpecsField('boundaryWallMade', event.target.value as 'Yes' | 'No')} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Gated colony</label>
                <select value={form.specs.isInGatedColony} onChange={(event) => setSpecsField('isInGatedColony', event.target.value as 'Yes' | 'No')} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Corner plot</label>
                <select value={form.specs.isCornerPlot} onChange={(event) => setSpecsField('isCornerPlot', event.target.value as 'Yes' | 'No')} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Floors allowed</label>
                <input type="number" value={form.specs.floorsAllowedForConstruction} onChange={(event) => setSpecsField('floorsAllowedForConstruction', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Floor no.</label>
                <input type="number" value={form.specs.floorNo} onChange={(event) => setSpecsField('floorNo', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Total floors</label>
                <input type="number" value={form.specs.totalFloors} onChange={(event) => setSpecsField('totalFloors', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Furnishing</label>
                <select value={form.specs.furnishing} onChange={(event) => setSpecsField('furnishing', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
                  <option value="">Select</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Furnished">Furnished</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Property age</label>
            <input type="text" value={form.specs.age} onChange={(event) => setSpecsField('age', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" placeholder="Ready to move, 1-5 years, new launch" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Facing</label>
            <select
              value={form.specs.facing}
              onChange={(event) => setSpecsField('facing', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
            >
              <option value="">Select</option>
              {FACING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Parking slots</label>
            <input type="number" value={form.specs.parking} onChange={(event) => setSpecsField('parking', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Possession status</label>
            <select value={form.specs.possessionStatus} onChange={(event) => setSpecsField('possessionStatus', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]">
              <option value="">Select</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Available from</label>
            <input type="date" value={form.specs.availableFrom} onChange={(event) => setSpecsField('availableFrom', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleSelection(amenity, 'amenities')}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition',
                    form.amenities.includes(amenity)
                      ? 'border-[#eb6239] bg-[#fff3ed] text-[#1f2a2e]'
                      : 'border-[#eadcca] bg-white text-[#667085]',
                  )}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleSelection(tag, 'tags')}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition',
                    form.tags.includes(tag)
                      ? 'border-[#1f2a2e] bg-[#1f2a2e] text-white'
                      : 'border-[#eadcca] bg-white text-[#667085]',
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Buyer-facing highlights</label>
          <div className="space-y-3">
            {form.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(event) => updateHighlight(index, event.target.value)}
                  className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
                  placeholder="Near expressway, corner unit, park facing, strong rental catchment"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#eadcca] bg-white text-[#667085] transition hover:border-red-200 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-2 rounded-full border border-[#eadcca] bg-white px-4 py-2 text-sm font-semibold text-[#1f2a2e] transition hover:border-[#eb6239]"
            >
              <Plus className="h-4 w-4" />
              Add highlight
            </button>
          </div>
        </div>
      </Section>

      <Section
        step="Step 4"
        icon={IndianRupee}
        title="Pricing & Commercials"
        description="Show the commercial picture clearly so buyers do not have to guess the total cost of moving ahead."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">
              {form.purpose === 'rent' ? 'Monthly rent' : 'Expected price'}
            </label>
            <input type="number" value={form.price} onChange={(event) => setField('price', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Maintenance</label>
            <input type="number" value={form.maintenance} onChange={(event) => setField('maintenance', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Security deposit</label>
            <input type="number" value={form.deposit} onChange={(event) => setField('deposit', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Booking / token amount</label>
            <input type="number" value={form.bookingAmount} onChange={(event) => setField('bookingAmount', event.target.value)} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
        </div>
      </Section>

      <Section
        step="Step 5"
        icon={ImagePlus}
        title="Media, Video & Floor Plans"
        description="The listing page should feel trustworthy on mobile and desktop, so add properly categorized visuals and any layout plans you have."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PHOTO_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-3 rounded-[24px] border border-[#eadcca] bg-white/85 p-4">
              <UploadTile
                label={category.label}
                helper={category.helper}
                count={photos[category.id].length}
                onFilesSelected={(files) => uploadFiles(files, category.id)}
                uploading={uploadingKey === category.id}
              />
              {photos[category.id].length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photos[category.id].map((photo, index) => (
                    <div key={`${photo.path || photo.url}-${index}`} className="relative">
                      <img
                        src={photo.url || '/placeholder.svg'}
                        alt={photo.label || `${category.label} ${index + 1}`}
                        className="h-20 w-20 rounded-[16px] border border-[#eadcca] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(category.id, index)}
                        className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#1f2a2e] shadow"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="rounded-[24px] border border-[#eadcca] bg-white/85 p-4">
            <UploadTile
              label="Floor plans"
              helper="Upload layout plans, dimension sheets, or PDF snapshots as images."
              count={floorplans.length}
              onFilesSelected={(files) => uploadFiles(files, 'floorplan')}
              uploading={uploadingKey === 'floorplan'}
            />
            {floorplans.length > 0 && (
              <div className="mt-3 space-y-2">
                {floorplans.map((plan, index) => (
                  <div key={`${plan.path || plan.url}-${index}`} className="flex items-center justify-between rounded-[18px] border border-[#eadcca] bg-[#fffaf5] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1f2a2e]">{plan.label || `Floor plan ${index + 1}`}</p>
                      <p className="text-xs text-[#667085]">Ready for the detail page floor-plan section</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFloorplan(index)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#eadcca] bg-white text-[#667085] transition hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-[#eadcca] bg-white/85 p-4">
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">YouTube / virtual tour URL</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(event) => setField('videoUrl', event.target.value)}
              className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <div className="mt-4 rounded-[22px] border border-dashed border-[#eadcca] bg-[#fffaf5] px-4 py-4 text-sm leading-6 text-[#667085]">
              <p className="font-semibold text-[#1f2a2e]">Media note</p>
              <p className="mt-2">
                Photos and floor plans are stored as structured media records so the detail page can build a proper gallery, thumbnail rail, and responsive floor-plan section for existing and future properties.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        step="Step 6"
        icon={PhoneCall}
        title="Private Seller Contact"
        description="This information stays with Property Ganj so buyers can request a callback without seeing the direct builder, owner, or agent details."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Seller / lister name</label>
            <input type="text" value={form.contact.name} onChange={(event) => setField('contact', { ...form.contact, name: event.target.value })} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Direct phone</label>
            <input type="text" value={form.contact.phone} onChange={(event) => setField('contact', { ...form.contact, phone: event.target.value })} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2a2e]">Direct email</label>
            <input type="email" value={form.contact.email} onChange={(event) => setField('contact', { ...form.contact, email: event.target.value })} className="w-full rounded-[20px] border border-[#eadcca] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#eb6239]" />
          </div>
        </div>

        <div className="rounded-[24px] border border-[#f0d7ca] bg-[#fff4ee] px-4 py-4 text-sm leading-6 text-[#8a4a33]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#7b3d27]">Public page behavior</p>
              <p className="mt-1">
                The listing page will show a Property Ganj callback flow instead of the seller&apos;s raw contact details. Buyers express interest, admins see that in the dashboard, and a property can be routed to an agent using the existing hold workflow.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-[#667085]">
          <Sparkles className="h-4 w-4 text-[#eb6239]" />
          {mode === 'admin'
            ? 'Curated Property Ganj listings get the same data depth as public submissions.'
            : isBuilderWorkspace
              ? 'Builder listings keep project and unit metadata structured while the public page still routes buyer callbacks through Property Ganj.'
              : 'The published page hides the seller contact and routes the buyer back through Property Ganj.'}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="rounded-full border-[#eadcca] bg-white px-6 py-3 text-[#1f2a2e]"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#eb6239] px-7 py-3 font-bold text-white shadow-[0_18px_40px_-20px_rgba(235,98,57,0.6)] hover:bg-[#d95c36]"
          >
            {submitting ? (
              <>
                <Layers3 className="mr-2 h-4 w-4 animate-pulse" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {submitLabel || (mode === 'admin' ? 'Publish Property Ganj Listing' : 'Publish Listing')}
              </>
            )}
          </Button>
        </div>
      </div>
      {showExitWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Discard changes?</h3>
            <p className="mt-2 text-sm text-slate-600">You have unsaved details in your listing. If you leave now, they will be lost.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => {
                  setShowExitWarning(false);
                  if (pendingAction) {
                    pendingAction();
                    setPendingAction(null);
                  }
                }}
                className="w-full rounded-xl bg-red-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                Yes, discard changes
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExitWarning(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel and keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
