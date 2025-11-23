import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
    builderId: mongoose.Types.ObjectId;
    name: string;
    reraId?: string;
    location: {
        locality: string;
        city: string;
        latitude?: number;
        longitude?: number;
    };
    description?: string;
    category: 'Apartment' | 'Villa' | 'Plot' | 'Commercial';
    minPrice: number;
    maxPrice: number;
    totalUnits?: number;
    status: 'Ongoing' | 'Ready to Move' | 'New Launch';
    coverImage?: string;
    gallery: string[];
    amenities: string[];
    possessionDate?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        builderId: {
            type: Schema.Types.ObjectId,
            ref: 'Builder',
            required: true,
        },
        name: { type: String, required: true, trim: true },
        reraId: { type: String, trim: true },
        location: {
            locality: { type: String, required: true, trim: true },
            city: { type: String, required: true, default: 'Lucknow', trim: true },
            latitude: { type: Number },
            longitude: { type: Number },
        },
        description: { type: String, trim: true },
        category: {
            type: String,
            enum: ['Apartment', 'Villa', 'Plot', 'Commercial'],
            required: true,
        },
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true },
        totalUnits: { type: Number },
        status: {
            type: String,
            enum: ['Ongoing', 'Ready to Move', 'New Launch'],
            required: true,
        },
        coverImage: { type: String, trim: true },
        gallery: [{ type: String, trim: true }],
        amenities: [{ type: String, trim: true }],
        possessionDate: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
