import { IsInt, Max, Min } from 'class-validator';

export class PrimaryAssessmentDto {
  @IsInt()
  @Min(0)
  @Max(1)
  hemorrhageIdentification!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  hemorrhageControl!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  airwayAssessment!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  airwayManagement!: number;

  @IsInt()
  @Min(0)
  @Max(1)
  ventilationAssessment!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  lungAuscultation!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  oxygenTherapy!: number;

  @IsInt()
  @Min(0)
  @Max(1)
  pulseAssessment!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  capillaryRefill!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  skinAssessment!: number;

  @IsInt()
  @Min(0)
  @Max(1)
  pirrl!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  glasgow!: number;

  @IsInt()
  @Min(0)
  @Max(1)
  exposure!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  temperatureManagement!: number;
}