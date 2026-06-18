import { Priority } from "@prisma/client";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateSubmissionDto {
  @IsOptional()
  @IsString()
  sceneManagement?: string;

  @IsOptional()
  @IsString()
  sss?: string;

  @IsOptional()
  @IsString()
  primaryTest?: string;

  @IsOptional()
  @IsString()
  sample?: string;

  @IsOptional()
  @IsString()
  opqrst?: string;

  @IsOptional()
  @IsString()
  presumptiveDiagnosis?: string;
  
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @IsOptional()
  @IsBoolean()
  transferDecision?: boolean;

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @IsString()
  reportPatient?: string;
}