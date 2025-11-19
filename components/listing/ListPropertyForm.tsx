'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building,
  Home,
  MapPin,
  IndianRupee,
  LinkIcon,
  CheckCircle2,
} from 'lucide-react';

import FileUploadButton from '@/components/FileUploadButton';
import LucknowLocationAutocomplete, { ResolvedLucknowLocation } from '@/components/location/LucknowLocationAutocomplete';
import { useToast } from '@/hooks/use-toast';
import { normalizeYouTubeUrl } from '@/lib/utils';
import type { PhotoCategory } from '@/models/Property';

type UserProfile = {
  name: string;
  phone: string;
  email?: string | null;
};

type FormValues = {
  // ... (all the form fields would be defined here)
};

type UploadedPhoto = {
  url: string;
  publicId?: string | null;
  provider?: string;
  category: PhotoCategory;
};

const OWNER_TYPES = [
  { id: 'owner', label: 'Owner' },
  { id: 'agent', label: 'Agent' },
  { id: 'builder', label: 'Builder' },
] as const;

const PURPOSE_OPTIONS = [
  { id: 'sale', label: 'Sale' },
  { id: 'rent', label: 'Rent / Lease' },
] as const;

const PROPERTY_TYPES = [
  'Apartment',
  'Independent House/Villa',
  'Plot/Land',
  'Studio',
  'Office Space',
  'Retail/Shop',
  'Warehouse',
  'Industrial',
] as const;

const AREA_UNIT_OPTIONS = [
  { value: 'sqft', label: 'Sq-ft' },
  { value: 'sq-yrd', label: 'Sq-yrd' },
  { value: 'sqm', label: 'Sq-m' },
  { value: 'acre', label: 'Acre' },
  { value: 'bigha', label: 'Bigha' },
  { value: 'hectare', label: 'Hectare' },
] as const;

const AMENITIES = [
  'Power Backup',
  'Lift',
  'Security',
  'Parking',
  'Gym',
  'Club House',
  'Swimming Pool',
  'Children Play Area',
  'Garden',
  'Intercom',
  'Fire Safety',
];

const TAGS = [
  'New Launch',
  'Ready to Move',
  'Exclusive',
  'Luxury',
  'Budget Friendly',
  'Sea View',
  'High Rental Yield',
];

const PHOTO_CATEGORIES: { id: PhotoCategory; label: string; helper: string }[] = [
  { id: 'siteView', label: 'Site View', helper: 'Capture the approach' },
  { id: 'exterior', label: 'Exterior', helper: 'Building elevation' },
  { id: 'commonArea', label: 'Common Area', helper: 'Lobbies / outdoors' },
  { id: 'livingRoom', label: 'Living Room', helper: 'Primary hall' },
  { id: 'bedrooms', label: 'Bedrooms', helper: 'Master & others' },
  { id: 'bathrooms', label: 'Bathrooms', helper: 'Bath fittings' },
  { id: 'kitchen', label: 'Kitchen', helper: 'Cooking space' },
  { id: 'floorPlan', label: 'Floor Plan', helper: 'Plan / layout' },
  { id: 'other', label: 'Extras', helper: 'Any other shots' },
];

const createEmptyPhotoState = () => {
  const state = {} as Record<PhotoCategory, UploadedPhoto[]>;
  PHOTO_CATEGORIES.forEach((category) => {
    state[category.id] = [];
  });
  return state;
};

type FormState = {
  ownerType: (typeof OWNER_TYPES)[number]['id'];
  purpose: 'sale' | 'rent';
  propertyType: (typeof PROPERTY_TYPES)[number];
  title: string;
  description: string;
  price: string;
  maintenance: string;
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
    // Plot specific
    noOfOpenSides: string;
    widthOfRoadFacing: string;
    anyConstructionDone: string;
    boundaryWallMade: string;
    isInGatedColony: string;
    isCornerPlot: string;
    // Residential specific
    furnishedStatus: string;
    floorsAllowedForConstruction: string;
    possessionStatus: string;
    availableFrom: string;
  };
  videoUrl: string;
};

const initialFormState: FormState = {
  ownerType: 'owner',
  purpose: 'sale',
  propertyType: 'Apartment',
  title: '',
  description: '',
  price: '',
  maintenance: '',
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
    // Plot specific
    noOfOpenSides: '',
    widthOfRoadFacing: '',
    anyConstructionDone: 'No',
    boundaryWallMade: 'No',
    isInGatedColony: 'No',
    isCornerPlot: 'No',
    // Residential specific
    furnishedStatus: '',
    floorsAllowedForConstruction: '',
    possessionStatus: '',
    availableFrom: '',
  },
  videoUrl: '',
};

interface ListPropertyFormProps {
  user: UserProfile | null;
}

export default function ListPropertyForm({ user }: ListPropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const defaultLocationQuery = initialFormState.location.locality || '';

  const [form, setForm] = useState<FormState>(initialFormState);
  const [locationQuery, setLocationQuery] = useState(defaultLocationQuery);
  const [contact, setContact] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [photos, setPhotos] = useState(createEmptyPhotoState);
  const [uploadingCategory, setUploadingCategory] = useState<PhotoCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const formatCoordinate = (value?: number) =>
    typeof value === 'number' && Number.isFinite(value) ? value.toFixed(6) : '';

  const parseCoordinate = (value?: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const sanitizeOptional = (value: string) => value.trim() || undefined;

  const handleLocationQueryChange = (value: string) => {
    setLocationQuery(value);
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        locality: value,
        city: prev.location.city || 'Lucknow',
        geoSource: 'manual',
      },
    }));
  };

  const buildLocationPayload = (location: FormState['location']) => ({
    city: location.city.trim() || 'Lucknow',
    locality: location.locality.trim() || '',
    area: sanitizeOptional(location.area),
    sector: sanitizeOptional(location.sector),
    block: sanitizeOptional(location.block),
    road: sanitizeOptional(location.road),
    address: sanitizeOptional(location.address),
    pincode: sanitizeOptional(location.pincode),
    landmark: sanitizeOptional(location.landmark),
    latitude: parseCoordinate(location.latitude),
    longitude: parseCoordinate(location.longitude),
    geoSource: location.geoSource,
  });

  const handleLucknowLocationSelect = (resolved: ResolvedLucknowLocation) => {
    setLocationQuery(resolved.label);
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: resolved.city || 'Lucknow',
        locality: resolved.locality || prev.location.locality,
        area: resolved.area || prev.location.area,
        sector: resolved.sector || prev.location.sector,
        block: resolved.block || prev.location.block,
        road: resolved.road || prev.location.road,
        address: resolved.formattedAddress || prev.location.address,
        pincode: resolved.pincode || prev.location.pincode,
        latitude: resolved.latitude ? formatCoordinate(resolved.latitude) : prev.location.latitude,
        longitude: resolved.longitude ? formatCoordinate(resolved.longitude) : prev.location.longitude,
        geoSource: 'geoapify',
      },
    }));
  };

  const handleSaveDraft = async () => {
    if (!form.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Give your property a catchy name to save as draft.',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingDraft(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || '',
        purpose: form.purpose,
        propertyType: form.propertyType,
        ownerType: form.ownerType,
        price: form.price ? Number(form.price) : 0,
        maintenance: form.maintenance ? Number(form.maintenance) : undefined,
        bookingAmount: form.bookingAmount ? Number(form.bookingAmount) : undefined,
        location: buildLocationPayload(form.location),
        specs: {
          bedrooms: form.specs.bedrooms ? Number(form.specs.bedrooms) : undefined,
          bathrooms: form.specs.bathrooms ? Number(form.specs.bathrooms) : undefined,
          balconies: form.specs.balconies ? Number(form.specs.balconies) : undefined,
          carpetArea: form.specs.carpetArea ? Number(form.specs.carpetArea) : undefined,
          builtUpArea: form.specs.builtUpArea ? Number(form.specs.builtUpArea) : undefined,
          plotArea: form.specs.plotArea ? Number(form.specs.plotArea) : undefined,
          areaUnit: form.specs.areaUnit,
          floorNo: form.specs.floorNo ? Number(form.specs.floorNo) : undefined,
          totalFloors: form.specs.totalFloors ? Number(form.specs.totalFloors) : undefined,
          furnishing: form.specs.furnishing,
          age: form.specs.age,
          facing: form.specs.facing,
          parking: form.specs.parking ? Number(form.specs.parking) : undefined,
          noOfOpenSides: form.specs.noOfOpenSides ? Number(form.specs.noOfOpenSides) : undefined,
          widthOfRoadFacing: form.specs.widthOfRoadFacing ? Number(form.specs.widthOfRoadFacing) : undefined,
          anyConstructionDone: form.specs.anyConstructionDone === 'Yes',
          boundaryWallMade: form.specs.boundaryWallMade === 'Yes',
          isInGatedColony: form.specs.isInGatedColony === 'Yes',
          isCornerPlot: form.specs.isCornerPlot === 'Yes',
          furnishedStatus: form.specs.furnishedStatus,
          floorsAllowedForConstruction: form.specs.floorsAllowedForConstruction ? Number(form.specs.floorsAllowedForConstruction) : undefined,
          possessionStatus: form.specs.possessionStatus,
          availableFrom: form.specs.availableFrom ? new Date(form.specs.availableFrom) : undefined,
        },
        amenities,
        tags,
        contact: {
          name: contact.name.trim(),
          phone: contact.phone.trim(),
          email: contact.email.trim() || undefined,
        },
        media: {
          photos: Object.values(photos).flat(),
          videoUrl: normalizeYouTubeUrl(form.videoUrl.trim()),
        },
        highlights: highlights.filter((item) => item.trim().length > 0),
        status: 'draft',
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save draft');
      }

      toast({
        title: 'Draft saved',
        description: 'Your property has been saved as draft.',
      });

      router.push('/profile/my-ads');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Unable to save draft',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section?: 'location' | 'specs'
  ) => {
    const { name, value } = event.target;
    setForm((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const toggleSelection = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handlePhotoUpload = async (files: FileList, category: PhotoCategory) => {
    setUploadingCategory(category);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append('file', file);
        body.append('category', category);

        const response = await fetch('/api/uploads/photos', {
          method: 'POST',
          body,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        setPhotos((prev) => ({
          ...prev,
          [category]: [
            ...prev[category],
            {
              url: data.url,
              publicId: data.publicId,
              provider: data.provider,
              category,
            },
          ],
        }));
      }

      toast({
        title: 'Photos added',
        description: `${files.length} image(s) ready for this category.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleRemovePhoto = (category: PhotoCategory, index: number) => {
    setPhotos((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, photoIndex) => photoIndex !== index),
    }));
  };

  const hasAtLeastOnePhoto = useMemo(() => {
    return Object.values(photos).some((categoryPhotos) => categoryPhotos.length > 0);
  }, [photos]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Give your property a catchy name.',
        variant: 'destructive',
      });
      return;
    }

    if (!form.price || Number.isNaN(Number(form.price))) {
      toast({
        title: 'Price required',
        description: 'Enter an indicative selling price.',
        variant: 'destructive',
      });
      return;
    }

    if (!hasAtLeastOnePhoto) {
      toast({
        title: 'Add at least one photo',
        description: 'Buyers engage better with visuals.',
        variant: 'destructive',
      });
      return;
    }

    // Check if user is logged in
    if (!user) {
      // Show toast prompting user to login
      toast({
        title: "Login Required",
        description: "You need to login or register to post your property listing. Saving your form data...",
      });

      // Save form data to localStorage
      try {
        const formDataToSave = {
          form,
          contact,
          amenities,
          tags,
          highlights,
          photos
        };
        localStorage.setItem('propertyFormData', JSON.stringify(formDataToSave));
      } catch (error) {
        console.error('Error saving form data:', error);
        toast({
          title: "Save Failed",
          description: "Could not save your form data. Please complete it again after login.",
          variant: "destructive",
        });
      }

      // Redirect to login after a delay to let the user see the toast
      setTimeout(() => {
        router.push('/auth');
      }, 3000); // 3 seconds delay
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        purpose: form.purpose,
        propertyType: form.propertyType,
        ownerType: form.ownerType,
        price: Number(form.price),
        maintenance: form.maintenance ? Number(form.maintenance) : undefined,
        bookingAmount: form.bookingAmount ? Number(form.bookingAmount) : undefined,
        location: buildLocationPayload(form.location),
        specs: {
          bedrooms: form.specs.bedrooms ? Number(form.specs.bedrooms) : undefined,
          bathrooms: form.specs.bathrooms ? Number(form.specs.bathrooms) : undefined,
          balconies: form.specs.balconies ? Number(form.specs.balconies) : undefined,
          carpetArea: form.specs.carpetArea ? Number(form.specs.carpetArea) : undefined,
          builtUpArea: form.specs.builtUpArea ? Number(form.specs.builtUpArea) : undefined,
          plotArea: form.specs.plotArea ? Number(form.specs.plotArea) : undefined,
          areaUnit: form.specs.areaUnit,
          floorNo: form.specs.floorNo ? Number(form.specs.floorNo) : undefined,
          totalFloors: form.specs.totalFloors ? Number(form.specs.totalFloors) : undefined,
          furnishing: form.specs.furnishing,
          age: form.specs.age,
          facing: form.specs.facing,
          parking: form.specs.parking ? Number(form.specs.parking) : undefined,
          // Plot specific
          noOfOpenSides: form.specs.noOfOpenSides ? Number(form.specs.noOfOpenSides) : undefined,
          widthOfRoadFacing: form.specs.widthOfRoadFacing ? Number(form.specs.widthOfRoadFacing) : undefined,
          anyConstructionDone: form.specs.anyConstructionDone === 'Yes',
          boundaryWallMade: form.specs.boundaryWallMade === 'Yes',
          isInGatedColony: form.specs.isInGatedColony === 'Yes',
          isCornerPlot: form.specs.isCornerPlot === 'Yes',
          // Residential specific
          furnishedStatus: form.specs.furnishedStatus,
          floorsAllowedForConstruction: form.specs.floorsAllowedForConstruction ? Number(form.specs.floorsAllowedForConstruction) : undefined,
          possessionStatus: form.specs.possessionStatus,
          availableFrom: form.specs.availableFrom ? new Date(form.specs.availableFrom) : undefined,
        },
        amenities,
        tags,
        contact: {
          name: contact.name.trim(),
          phone: contact.phone.trim(),
          email: contact.email.trim() || undefined,
        },
        media: {
          photos: Object.values(photos).flat(),
          videoUrl: normalizeYouTubeUrl(form.videoUrl.trim()),
        },
        highlights: highlights.filter((item) => item.trim().length > 0),
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post property');
      }

      toast({
        title: 'Listing published',
        description: 'Your property is live now.',
      });

      // Redirect to property detail page
      const propertyId = data.property._id || data.property.id;
      if (propertyId) {
        router.push(`/property/${propertyId}`);
      } else {
        router.push('/profile/my-ads');
      }
      router.refresh();
    } catch (error) {
      toast({
        title: 'Unable to post property',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlotFields = () => (
    <>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">No. of Open Sides</label>
        <select name="noOfOpenSides" value={form.specs.noOfOpenSides} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="">Select</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Width of Road Facing (in meters)</label>
        <input type="number" name="widthOfRoadFacing" value={form.specs.widthOfRoadFacing} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Any Construction Done?</label>
        <select name="anyConstructionDone" value={form.specs.anyConstructionDone} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Boundary Wall Made?</label>
        <select name="boundaryWallMade" value={form.specs.boundaryWallMade} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Is in a Gated Colony?</label>
        <select name="isInGatedColony" value={form.specs.isInGatedColony} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Is this a corner plot?</label>
        <select name="isCornerPlot" value={form.specs.isCornerPlot} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div className="md:col-span-3 grid gap-4 md:grid-cols-2">
        <div>
          <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Plot Area</label>
          <input
            type="number"
            name="plotArea"
            value={form.specs.plotArea}
            onChange={(e) => handleInputChange(e, 'specs')}
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
            placeholder="e.g. 2150"
          />
        </div>
        <div>
          <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Area Unit</label>
          <select
            name="areaUnit"
            value={form.specs.areaUnit}
            onChange={(e) => handleInputChange(e, 'specs')}
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
          >
            {AREA_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );

  const renderResidentialFields = () => (
    <>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Bedrooms (BHK) <span className="text-red-500">*</span></label>
        <input type="number" name="bedrooms" value={form.specs.bedrooms} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" required />
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Bathrooms <span className="text-red-500">*</span></label>
        <input type="number" name="bathrooms" value={form.specs.bathrooms} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" required />
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Balconies</label>
        <input type="number" name="balconies" value={form.specs.balconies} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Floor No.</label>
        <input type="number" name="floorNo" value={form.specs.floorNo} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Total Floors</label>
        <input type="number" name="totalFloors" value={form.specs.totalFloors} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Furnished Status</label>
        <select name="furnishedStatus" value={form.specs.furnishedStatus} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="">Select</option>
          <option value="Unfurnished">Unfurnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Furnished">Furnished</option>
        </select>
      </div>
      <div>
        <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Possession Status</label>
        <select name="possessionStatus" value={form.specs.possessionStatus} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]">
          <option value="">Select</option>
          <option value="Ready to Move">Ready to Move</option>
          <option value="Under Construction">Under Construction</option>
        </select>
      </div>
      {form.specs.possessionStatus === 'Under Construction' && (
        <div>
          <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Available From</label>
          <input type="date" name="availableFrom" value={form.specs.availableFrom} onChange={(e) => handleInputChange(e, 'specs')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
        </div>
      )}
      <div className="md:col-span-3 grid gap-4 md:grid-cols-2">
        <div>
          <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Carpet Area</label>
          <input
            type="number"
            name="carpetArea"
            value={form.specs.carpetArea}
            onChange={(e) => handleInputChange(e, 'specs')}
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
            placeholder="e.g. 1250"
          />
        </div>
        <div>
          <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Area Unit</label>
          <select
            name="areaUnit"
            value={form.specs.areaUnit}
            onChange={(e) => handleInputChange(e, 'specs')}
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
          >
            {AREA_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-3xl border border-[#264143]/15 bg-white/90 p-6 shadow-[0_25px_80px_rgba(38,65,67,0.08)]">
        <p className="text-xs uppercase font-semibold tracking-[0.3em] text-[#9ca3af]">
          Step 1
        </p>
        <div className="flex items-center gap-3 mt-2 mb-6">
          <Building className="text-[#eb6239]" />
          <h2 className="text-2xl font-black text-[#1f2a2e]">
            Basic Property Info
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {OWNER_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, ownerType: type.id }))}
              className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                form.ownerType === type.id
                  ? 'border-[#eb6239] bg-[#fff3ed] shadow-[4px_4px_0_#f8c18a]'
                  : 'border-[#e5e7eb]'
              }`}
            >
              <p className="font-semibold text-[#1f2a2e]">{type.label}</p>
              <p className="text-xs text-[#6b7280]">
                {type.id === 'owner'
                  ? 'List as direct owner'
                  : type.id === 'agent'
                  ? 'Registered agent/broker'
                  : 'Builder or developer'}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PURPOSE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, purpose: option.id }))}
              className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                form.purpose === option.id
                  ? 'border-[#1f2a2e] bg-[#1f2a2e] text-white'
                  : 'border-[#e5e7eb]'
              }`}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="text-xs opacity-80">
                {option.id === 'sale'
                  ? 'Sell outright with title transfer'
                  : 'Lease out or rent for steady income'}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="font-semibold text-[#1f2a2e] text-sm mb-2 block">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="e.g. Sun-facing 3 BHK in Gomti Nagar"
              className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-[#1f2a2e] text-sm mb-2 block">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.propertyType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, propertyType: e.target.value as FormState['propertyType'] }))
              }
              className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="font-semibold text-[#1f2a2e] text-sm mb-2 block">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Highlight key selling points, connectivity, neighborhood vibe, etc."
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-[#264143]/15 bg-white/90 p-6 shadow-[0_25px_80px_rgba(38,65,67,0.08)]">
        <p className="text-xs uppercase font-semibold tracking-[0.3em] text-[#9ca3af]">
          Step 2
        </p>
        <div className="flex items-center gap-3 mt-2 mb-6">
          <MapPin className="text-[#eb6239]" />
          <h2 className="text-2xl font-black text-[#1f2a2e]">Location Details</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">City <span className="text-red-500">*</span></label>
            <input type="text" name="city" value={form.location.city} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" required />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Locality <span className="text-red-500">*</span></label>
            <LucknowLocationAutocomplete
              value={locationQuery}
              onChange={handleLocationQueryChange}
              onSelect={handleLucknowLocationSelect}
              showDetectButton
              className="w-full"
            />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Area / Zone</label>
            <input type="text" name="area" value={form.location.area} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Sector / Block</label>
            <input type="text" name="sector" value={form.location.sector} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" placeholder="e.g. Sector 5, Block D" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Sub-block / Colony</label>
            <input type="text" name="block" value={form.location.block} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" placeholder="e.g. Awadh Vihar, Pocket 2" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Address</label>
            <input type="text" name="address" value={form.location.address} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Primary Road</label>
            <input type="text" name="road" value={form.location.road} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" placeholder="e.g. Shaheed Path" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Pincode</label>
            <input type="text" name="pincode" value={form.location.pincode} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Landmark</label>
            <input type="text" name="landmark" value={form.location.landmark} onChange={(event) => handleInputChange(event, 'location')} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#264143]/15 bg-white/90 p-6 shadow-[0_25px_80px_rgba(38,65,67,0.08)]">
        <p className="text-xs uppercase font-semibold tracking-[0.3em] text-[#9ca3af]">
          Step 3
        </p>
        <div className="flex items-center gap-3 mt-2 mb-6">
          <Home className="text-[#eb6239]" />
          <h2 className="text-2xl font-black text-[#1f2a2e]">
            Property Specifications
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {form.propertyType === 'Plot/Land' ? renderPlotFields() : renderResidentialFields()}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleSelection(amenity, amenities, setAmenities)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    amenities.includes(amenity)
                      ? 'border-[#eb6239] bg-[#fff3ed]'
                      : 'border-[#e5e7eb]'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleSelection(tag, tags, setTags)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    tags.includes(tag)
                      ? 'border-[#264143] bg-[#264143] text-white'
                      : 'border-[#e5e7eb]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">
              Highlights
            </label>
            {highlights.map((highlight, index) => (
              <input
                key={index}
                type="text"
                value={highlight}
                onChange={(event) =>
                  setHighlights((prev) =>
                    prev.map((item, idx) => (idx === index ? event.target.value : item))
                  )
                }
                className="mb-2 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
                placeholder="Add highlight"
              />
            ))}
            <button
              type="button"
              onClick={() => setHighlights((prev) => [...prev, ''])}
              className="text-sm font-semibold text-[#eb6239]"
            >
              + Add another highlight
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#264143]/15 bg-white/90 p-6 shadow-[0_25px_80px_rgba(38,65,67,0.08)]">
        <p className="text-xs uppercase font-semibold tracking-[0.3em] text-[#9ca3af]">
          Step 4
        </p>
        <div className="flex items-center gap-3 mt-2 mb-6">
          <IndianRupee className="text-[#eb6239]" />
          <h2 className="text-2xl font-black text-[#1f2a2e]">Pricing</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Expected Price (₹) <span className="text-red-500">*</span></label>
            <input type="number" name="price" value={form.price} onChange={handleInputChange} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" required />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Monthly Maintenance (₹)</label>
            <input type="number" name="maintenance" value={form.maintenance} onChange={handleInputChange} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">Booking / Token Amount (₹)</label>
            <input type="number" name="bookingAmount" value={form.bookingAmount} onChange={handleInputChange} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#264143]/15 bg-white/90 p-6 shadow-[0_25px_80px_rgba(38,65,67,0.08)]">
        <p className="text-xs uppercase font-semibold tracking-[0.3em] text-[#9ca3af]">
          Step 5
        </p>
        <div className="flex items-center gap-3 mt-2 mb-6">
          <LinkIcon className="text-[#eb6239]" />
          <h2 className="text-2xl font-black text-[#1f2a2e]">
            Media & Virtual Tour
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PHOTO_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-[#e5e7eb] bg-white/70 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#1f2a2e]">{category.label}</p>
                  <p className="text-xs text-[#9ca3af]">{category.helper}</p>
                </div>
                <span className="text-xs font-semibold text-[#6b7280]">
                  {photos[category.id].length} photos
                </span>
              </div>
              <FileUploadButton
                label="Add photo"
                helperText="Upload images"
                onFilesSelected={(files) => handlePhotoUpload(files, category.id)}
                uploadedCount={photos[category.id].length}
                isUploading={uploadingCategory === category.id}
              />
              {photos[category.id].length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photos[category.id].map((photo, index) => (
                    <div key={photo.url} className="relative">
                      <img
                        src={photo.url}
                        alt={`${category.label} ${index + 1}`}
                        className="h-16 w-16 rounded-lg border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(category.id, index)}
                        className="absolute -right-1 -top-1 rounded-full bg-white px-[6px] text-xs font-bold shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block">
            YouTube Video Link
          </label>
          <input
            type="url"
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-[#264143]/15 bg-white/90 p-6 shadow-[0_25px_80px_rgba(38,65,67,0.08)]">
        <p className="text-xs uppercase font-semibold tracking-[0.3em] text-[#9ca3af]">
          Step 6
        </p>
        <div className="flex items-center gap-3 mt-2 mb-6">
          <CheckCircle2 className="text-[#eb6239]" />
          <h2 className="text-2xl font-black text-[#1f2a2e]">
            Owner / Agent Contact
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={contact.name} onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" required />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Phone <span className="text-red-500">*</span></label>
            <input type="text" name="phone" value={contact.phone} onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-none focus:border-[#eb6239]" required />
          </div>
          <div>
            <label className="font-semibold text-sm text-[#1f2a2e] mb-2 block capitalize">Email</label>
            <input type="text" name="email" value={contact.email} onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 outline-നെ focus:border-[#eb6239]" />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            setForm(initialFormState);
            setAmenities([]);
            setTags([]);
            setHighlights(['']);
            setPhotos(createEmptyPhotoState());
            setLocationQuery(defaultLocationQuery);
          }}
          className="rounded-full border border-[#e5e7eb] px-6 py-3 font-semibold text-[#1f2a2e]"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSavingDraft || isSubmitting}
          className="rounded-full border-2 border-[#eb6239] px-6 py-3 font-semibold text-[#eb6239] hover:bg-[#eb6239] hover:text-white transition-colors disabled:opacity-60"
        >
          {isSavingDraft ? 'Saving…' : 'Save Draft'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isSavingDraft}
          className="rounded-full bg-gradient-to-r from-[#eb6239] to-[#d6522f] px-8 py-3 font-bold text-white shadow-[0_15px_40px_rgba(235,98,57,0.35)] disabled:opacity-60"
        >
          {isSubmitting ? 'Publishing…' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
}

