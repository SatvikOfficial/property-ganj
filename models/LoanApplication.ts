import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoanApplication extends Document {
    name: string;
    phone: string;
    loanAmount: number;
    city: string;
    status: 'new' | 'contacted' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

const LoanApplicationSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        loanAmount: { type: Number, required: true },
        city: { type: String, required: true },
        status: {
            type: String,
            enum: ['new', 'contacted', 'closed'],
            default: 'new',
        },
    },
    { timestamps: true }
);

const LoanApplication: Model<ILoanApplication> =
    mongoose.models.LoanApplication ||
    mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);

export default LoanApplication;
