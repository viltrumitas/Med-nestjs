import { IsInt, Min, Max } from 'class-validator';

export class VitalSignsDto {
  @IsInt()
  @Min(0)
  @Max(1)
  fc!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  fr!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  ta!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  temperature!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  glucose!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  spo2!: number;
}