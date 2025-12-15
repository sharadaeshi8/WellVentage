import { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  googleId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gymId: Types.ObjectId;
  role: 'owner' | 'admin' | 'receptionist' | 'trainer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String },
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'receptionist', 'trainer'],
      default: 'owner',
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ gymId: 1 });
