import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @IsString()
  @IsNotEmpty()
  phone!: string; // raw phone from client, can include spaces

  @IsString()
  @IsOptional()
  country?: string; // optional ISO country, e.g., 'IN', 'US'
}