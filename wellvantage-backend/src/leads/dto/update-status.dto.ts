import { IsOptional, IsString, IsIn, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStatusDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  inquiryDate?: Date;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsIn(['Hot', 'Warm', 'Cold'])
  interestLevel?: 'Hot' | 'Warm' | 'Cold';

  @IsOptional()
  @IsIn(['New Inquiry', 'Needs Follow-Up', 'Engaged', 'Converted', 'Archived'])
  followUpStatus?: string;

  @IsOptional()
  @IsString()
  preferredPackage?: string;

  @IsOptional()
  @IsString()
  preferredPTPackage?: string;

  @IsOptional()
  @IsIn(['Social Media', 'Word of Mouth', 'Walk-in', 'WellVantage B2C App'])
  howHeardAboutGym?: 'Social Media' | 'Word of Mouth' | 'Walk-in' | 'WellVantage B2C App';
}
