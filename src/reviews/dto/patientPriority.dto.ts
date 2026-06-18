import { IsInt, Max, Min } from 'class-validator';

export class PatientPriority {
  @IsInt()
  @Min(0)
  @Max(1)
  patientPriority!: number;

  @IsInt()
  @Min(0)
  @Max(1)
  transferPatientDecision!: number;
}