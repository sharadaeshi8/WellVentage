import { IsOptional, IsString, IsArray, IsBoolean, IsIn } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsIn(['Sedentary', 'Lightly active', 'Moderately active', 'Very active'])
  activityLevel?: 'Sedentary' | 'Lightly active' | 'Moderately active' | 'Very active';

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
