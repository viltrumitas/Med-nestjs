import { IsInt, Min, Max } from 'class-validator';

export class PhysicalExaminationDto {
  @IsInt()
  @Min(0)
  @Max(1)
  head!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  neck!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  thorax!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  abdomen!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  pelvis!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  spine!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  lowerExtremities!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  upperExtremities!: number;
}