import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  IsObject,
  IsBoolean,
} from 'class-validator';

class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class CreatePreferenceDto {
  @IsOptional()
  @IsIn(['Sedentary', 'Lightly active', 'Moderately active', 'Very active'])
  activityLevel?:
    | 'Sedentary'
    | 'Lightly active'
    | 'Moderately active'
    | 'Very active';

  @IsOptional()
  @IsArray()
  wellnessGoals?: string[];

  @IsOptional()
  @IsString()
  primaryFitnessFocus?: string;

  @IsOptional()
  @IsIn(['Morning', 'Afternoon', 'Evening', 'Late evening'])
  preferredGymTime?: 'Morning' | 'Afternoon' | 'Evening' | 'Late evening';

  @IsOptional()
  @IsIn(['Light', 'Moderate', 'High'])
  preferredWorkoutIntensity?: 'Light' | 'Moderate' | 'High';

  @IsOptional()
  @IsArray()
  medicalConcerns?: string[];

  @IsOptional()
  @IsString()
  medicalConcernsOther?: string;

  @IsOptional()
  @IsBoolean()
  previousGymExperience?: boolean;
}

class LeadStatusDto {
  @IsOptional()
  @IsDateString()
  inquiryDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsIn(['Hot', 'Warm', 'Cold'])
  interestLevel?: 'Hot' | 'Warm' | 'Cold';

  @IsOptional()
  @IsIn(['New Inquiry', 'Needs Follow-Up', 'Engaged', 'Converted', 'Archived'])
  followUpStatus?:
    | 'New Inquiry'
    | 'Needs Follow-Up'
    | 'Engaged'
    | 'Converted'
    | 'Archived';

  @IsOptional()
  @IsString()
  preferredPackage?: string;

  @IsOptional()
  @IsString()
  preferredPTPackage?: string;

  @IsOptional()
  @IsIn(['Social Media', 'Word of Mouth', 'Walk-in', 'WellVantage B2C App'])
  howHeardAboutGym?:
    | 'Social Media'
    | 'Word of Mouth'
    | 'Walk-in'
    | 'WellVantage B2C App';
}

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['Male', 'Female', 'Non binary/Other'])
  gender?: 'Male' | 'Female' | 'Non binary/Other';

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  heightUnit?: string;

  @IsOptional()
  @IsString()
  weightUnit?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePreferenceDto)
  preferences?: CreatePreferenceDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LeadStatusDto)
  status?: LeadStatusDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNoteDto)
  notes?: CreateNoteDto[];
}
