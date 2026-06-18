import { IsNumber, IsInt, Min, Max } from 'class-validator';

export class OtherInterventionsDto {
  @IsInt()
  @Min(0)
  @Max(3)
  vascularAccess!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  temperatureControl!: number;
  @IsInt()
  @Min(0)
  @Max(2)
  drugAdministration!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  patientPositioning!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  packaging!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  crumRegulation!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  uniform!: number;
  @IsInt()
  @Min(0)
  @Max(3)
  workTeam!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  interventionsPerformed!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  teamWork!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  correctDiagnosis!: number;
}