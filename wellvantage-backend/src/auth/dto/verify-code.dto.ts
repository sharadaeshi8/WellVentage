import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsOptional()
  country?: string;
}