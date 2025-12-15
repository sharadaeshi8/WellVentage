export interface Lead {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  gender?: "Male" | "Female" | "Non binary/Other";
  dateOfBirth?: Date | string;
  height?: number;
  weight?: number;
  heightUnit?: string;
  weightUnit?: string;
  preferences?: LeadPreferences;
  status?: LeadStatusInfo;
  notes?: LeadNote[];
  lastInteractionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadPreferences {
  activityLevel?: ActivityLevel;
  wellnessGoals?: string[];
  primaryFitnessFocus?: PrimaryFitnessFocus;
  preferredGymTime?: PreferredGymTime;
  preferredWorkoutIntensity?: WorkoutIntensity;
  medicalConcerns?: string[];
  medicalConcernsOther?: string;
  previousGymExperience?: boolean;
}

export interface LeadStatusInfo {
  inquiryDate?: Date | string;
  assignedTo?: string | AssignedUser;
  interestLevel?: InterestLevel;
  followUpStatus?: FollowUpStatus;
  preferredPackage?: string;
  preferredPTPackage?: string;
  howHeardAboutGym?: LeadSource;
}

export interface AssignedUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
}

export interface LeadNote {
  content: string;
  date?: string;
  // Optional fields that might be added by the server
  _id?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Gym {
  _id: string;
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
}

export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  profilePicture?: string;
  gymId: string;
  role: "owner" | "admin" | "receptionist" | "trainer";
}

export interface AuthMeResponse {
  user: User | null;
}

export type ActivityLevel =
  | "Sedentary"
  | "Lightly active"
  | "Moderately active"
  | "Very active"
  | string;

export type PrimaryFitnessFocus =
  | "Gym workouts"
  | "Yoga"
  | "Meditation"
  | "Nutrition"
  | "Recovery"
  | string;

export type PreferredGymTime =
  | "Morning"
  | "Afternoon"
  | "Evening"
  | "Late evening"
  | string;

export type FlexibleString<T extends string> = T | string;
export type WorkoutIntensity = FlexibleString<"Light" | "Moderate" | "High">;
export type InterestLevel = FlexibleString<"Hot" | "Warm" | "Cold">;

export type FollowUpStatus = FlexibleString<
  "New Inquiry" | "Needs Follow-Up" | "Engaged" | "Converted" | "Archived"
>;

export type LeadSource = FlexibleString<
  "Social Media" | "Word of Mouth" | "Walk-in" | "WellVantage B2C App"
>;
