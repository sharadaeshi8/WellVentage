import { Schema, Document } from 'mongoose';

export interface IGym extends Document {
  name: string;
  ownerFirstName: string;
  ownerLastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const GymSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerFirstName: { type: String, required: true },
    ownerLastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    phoneVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
