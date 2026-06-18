import {
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export class NeurologicalDto {
  @IsOptional()
  @IsObject()
  cincinnati?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  glasgow?: number;
}