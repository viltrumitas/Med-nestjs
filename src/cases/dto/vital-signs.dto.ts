import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VitalSignsDto {
  @IsOptional()
  @IsString()
  ta?: string;

  @IsOptional()
  @IsNumber()
  fc?: number;

  @IsOptional()
  @IsNumber()
  fr?: number;

  @IsOptional()
  @IsNumber()
  spo2?: number;

  @IsOptional()
  @IsNumber()
  glucose?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  capillaryFiller?: number;
}