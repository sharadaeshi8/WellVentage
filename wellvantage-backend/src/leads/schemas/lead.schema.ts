import { Schema, Document, Types } from 'mongoose';
import { stringify } from 'node:querystring';

const NoteSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true },
});

const PreferencesSchema = new Schema(
  {
    activityLevel: {
      type: String,
      enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'],
    },
    wellnessGoals: [
      {
        type: String,
        enum: [
          'Lose weight',
          'Gain weight',
          'Build muscle',
          'Modify My Diet',
          'Manage Stress',
          'Improve Step Count',
          'General wellness',
        ],
      },
    ],
    primaryFitnessFocus: {
      type: String,
      enum: ['Gym workouts', 'Yoga', 'Meditation', 'Nutrition', 'Recovery'],
    },
    preferredGymTime: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Late evening'],
    },
    preferredWorkoutIntensity: {
      type: String,
      enum: ['Light', 'Moderate', 'High'],
    },
    medicalConcerns: [
      {
        type: String,
        enum: ['Diabetes', 'Hypertension', 'Asthma', 'Others', 'None'],
      },
    ],
    medicalConcernsOther: { type: String },
    previousGymExperience: { type: Boolean, default: false },
  },
  { _id: false },
);

const StatusSchema = new Schema(
  {
    inquiryDate: { type: Date, required: true, default: Date.now },
    assignedTo: {
      type: String,
    },
    interestLevel: {
      type: String,
      enum: ['Hot', 'Warm', 'Cold'],
      required: true,
      default: 'Cold',
    },
    followUpStatus: {
      type: String,
      enum: [
        'New Inquiry',
        'Needs Follow-Up',
        'Engaged',
        'Converted',
        'Archived',
      ],
      default: 'New Inquiry',
    },
    preferredPackage: { type: String },
    preferredPTPackage: { type: String },
    howHeardAboutGym: {
      type: String,
      enum: ['Social Media', 'Word of Mouth', 'Walk-in', 'WellVantage B2C App'],
    },
  },
  { _id: false },
);

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Non binary/Other';
  dateOfBirth?: Date;
  height?: number;
  weight?: number;
  preferences: typeof PreferencesSchema;
  status: typeof StatusSchema;
  notes: (typeof NoteSchema)[];
  gymId: Types.ObjectId;
  isArchived: boolean;
  lastInteractionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const LeadSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non binary/Other'],
    },
    dateOfBirth: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    heightUnit: { type: String },
    weightUnit: { type: String },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    status: { type: StatusSchema, default: () => ({}) },
    notes: [NoteSchema],
    gymId: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    isArchived: { type: Boolean, default: false },
    lastInteractionDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

LeadSchema.index({ gymId: 1, isArchived: 1 });
LeadSchema.index({ 'status.interestLevel': 1 });
LeadSchema.index({ 'status.followUpStatus': 1 });
LeadSchema.index({ 'status.assignedTo': 1 });
LeadSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
LeadSchema.index({ lastInteractionDate: -1 });
LeadSchema.index({ createdAt: -1 });

LeadSchema.virtual('fullName').get(function (this: any) {
  return `${this.firstName} ${this.lastName}`;
});

LeadSchema.set('toJSON', { virtuals: true });
LeadSchema.set('toObject', { virtuals: true });
