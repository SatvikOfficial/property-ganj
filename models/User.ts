import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  supabaseId?: string;
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  likedProperties: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'agent' | 'admin' | 'builder';
  agentProfile?: {
    experience?: number;
    specialization?: string[];
    languages?: string[];
    bio?: string;
    location?: string;
    isVerified?: boolean;
    photoUrl?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    supabaseId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      default: null,
      lowercase: true,
      trim: true,
      match: [/(^$)|(^\S+@\S+\.\S+$)/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    likedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'agent', 'admin', 'builder'],
      default: 'user',
    },
    agentProfile: {
      experience: { type: Number },
      specialization: [{ type: String }], // Changed to array
      languages: [{ type: String }], // Added languages
      bio: { type: String },
      location: { type: String },
      isVerified: { type: Boolean, default: false },
      photoUrl: { type: String },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

