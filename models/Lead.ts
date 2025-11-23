import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
    name: string;
    phone: string;
    email?: string;
    type: 'agent_contact' | 'property_inquiry';
    targetId: string; // Agent ID or Property ID
    targetName?: string; // Agent Name or Property Title
    status: 'new' | 'contacted' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ['agent_contact', 'property_inquiry'],
            required: true,
        },
        targetId: {
            type: String,
            required: true,
        },
        targetName: {
            type: String,
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'closed'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

const Lead: Model<ILead> =
    mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
