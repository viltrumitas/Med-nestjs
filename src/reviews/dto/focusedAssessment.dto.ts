import { IsInt, Min, Max } from 'class-validator';

export class FocusedAssessmentDto {
  @IsInt()
  @Min(0)
  @Max(1)
  inspection!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  palpation!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  auscultation!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  percussion!: number;
}