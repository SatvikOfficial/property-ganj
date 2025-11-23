import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBuilder extends Document {
    name: string;
    reraId?: string;
    logoUrl?: string;
    description?: string;
    establishedYear?: number;
    totalProjects?: number;
    ongoingProjects?: number;
    completedProjects?: number;
    headquarters?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const BuilderSchema = new Schema<IBuilder>(
    {
        name: { type: String, required: true, trim: true },
        reraId: { type: String, trim: true },
        logoUrl: { type: String, trim: true },
        description: { type: String, trim: true },
        establishedYear: { type: Number },
        totalProjects: { type: Number, default: 0 },
        ongoingProjects: { type: Number, default: 0 },
        completedProjects: { type: Number, default: 0 },
        headquarters: { type: String, trim: true },
        contactEmail: { type: String, trim: true },
        contactPhone: { type: String, trim: true },
        website: { type: String, trim: true },
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
    }
);

const Builder: Model<IBuilder> =
    mongoose.models.Builder || mongoose.model<IBuilder>('Builder', BuilderSchema);

export default Builder;
