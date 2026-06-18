import { IsInt, Min, Max } from 'class-validator';

export class SamplerDto {
  @IsInt()
  @Min(0)
  @Max(1)
  signs!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  symptoms!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  allergies!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  medications!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  conditions!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  riskFactors!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  livings!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  previousEvents!: number;
}

export class OpqrstDto {
  @IsInt()
  @Min(0)
  @Max(1)
  onset!: number
  @IsInt()
  @Min(0)
  @Max(1)
  provocation!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  quality!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  region!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  severity!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  time!: number;
}