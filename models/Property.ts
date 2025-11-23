import mongoose, { Schema, Document, Model } from 'mongoose';

export type PhotoCategory =
  | 'siteView'
  | 'exterior'
  | 'commonArea'
  | 'livingRoom'
  | 'bedrooms'
  | 'bathrooms'
  | 'kitchen'
  | 'floorPlan'
  | 'other';

export interface PropertyMedia {
  url: string;
  category: PhotoCategory;
  publicId?: string | null;
  label?: string;
}

export interface IProperty extends Document {
  title: string;
  description?: string;
  purpose: 'sale' | 'rent';
  propertyType: string;
  ownerType: 'owner' | 'agent' | 'builder';
  listedBy: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  builderId?: mongoose.Types.ObjectId;
  price: number;
  currency: string;
  maintenance?: number;
  bookingAmount?: number;
  location: {
    address?: string;
    locality?: string;
    area?: string;
    sector?: string;
    block?: string;
    road?: string;
    neighbourhood?: string;
    city: string;
    state?: string;
    pincode?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    geoSource?: 'geoapify' | 'manual';
  };
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    parking?: number;
    carpetArea?: number;
    builtUpArea?: number;
    plotArea?: number;
    areaUnit?: string;
    furnishing?: string;
    floorNo?: number;
    totalFloors?: number;
    age?: string;
    facing?: string;
    // Plot specific
    noOfOpenSides?: number;
    widthOfRoadFacing?: number;
    anyConstructionDone?: boolean;
    boundaryWallMade?: boolean;
    isInGatedColony?: boolean;
    isCornerPlot?: boolean;
    // Residential specific
    furnishedStatus?: string;
    floorsAllowedForConstruction?: number;
    possessionStatus?: string;
    availableFrom?: Date;
  };
  amenities: string[];
  tags: string[];
  media: {
    photos: PropertyMedia[];
    videoUrl?: string;
  };
  contact: {
    name: string;
    phone: string;
    email?: string | null;
  };
  highlights: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<PropertyMedia>(
  {
    url: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'siteView',
        'exterior',
        'commonArea',
        'livingRoom',
        'bedrooms',
        'bathrooms',
        'kitchen',
        'floorPlan',
        'other',
      ],
      default: 'other',
    },
    publicId: { type: String, default: null },
    label: { type: String },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    purpose: {
      type: String,
      enum: ['sale', 'rent'],
      required: true,
    },
    propertyType: { type: String, required: true, trim: true },
    ownerType: {
      type: String,
      enum: ['owner', 'agent', 'builder'],
      required: true,
    },
    listedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    builderId: {
      type: Schema.Types.ObjectId,
      ref: 'Builder',
    },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    maintenance: { type: Number },
    bookingAmount: { type: Number },
    location: {
      address: { type: String, trim: true },
      locality: { type: String, trim: true },
      area: { type: String, trim: true },
      sector: { type: String, trim: true },
      block: { type: String, trim: true },
      road: { type: String, trim: true },
      neighbourhood: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      landmark: { type: String, trim: true },
      latitude: { type: Number },
      longitude: { type: Number },
      geoSource: {
        type: String,
        enum: ['geoapify', 'manual'],
        default: 'manual',
      },
    },
    specs: {
      bedrooms: { type: Number },
      bathrooms: { type: Number },
      balconies: { type: Number },
      parking: { type: Number },
      carpetArea: { type: Number },
      builtUpArea: { type: Number },
      plotArea: { type: Number },
      areaUnit: { type: String, default: 'sqft' },
      furnishing: { type: String },
      floorNo: { type: Number },
      totalFloors: { type: Number },
      age: { type: String },
      facing: { type: String },
      // Plot specific
      noOfOpenSides: { type: Number },
      widthOfRoadFacing: { type: Number },
      anyConstructionDone: { type: Boolean },
      boundaryWallMade: { type: Boolean },
      isInGatedColony: { type: Boolean },
      isCornerPlot: { type: Boolean },
      // Residential specific
      furnishedStatus: { type: String },
      floorsAllowedForConstruction: { type: Number },
      possessionStatus: { type: String },
      availableFrom: { type: Date },
    },
    amenities: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    media: {
      photos: {
        type: [MediaSchema],
        default: [],
      },
      videoUrl: { type: String, trim: true },
    },
    contact: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
    },
    highlights: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

PropertySchema.index({ purpose: 1, propertyType: 1, 'location.city': 1 });
PropertySchema.index({ tags: 1 });
PropertySchema.index({
  title: 'text',
  description: 'text',
  propertyType: 'text',
  'location.locality': 'text',
  'location.city': 'text',
});

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;

