import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  purpose: 'register' | 'update-phone';
  codeHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: ['register', 'update-phone'],
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OtpSchema.index({ phone: 1, purpose: 1 }, { unique: true });

const Otp: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);

export default Otp;

