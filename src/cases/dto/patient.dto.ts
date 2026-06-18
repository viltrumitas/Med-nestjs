import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "@prisma/client";

export class PatientDto {
  @IsString()
  patientName!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsNumber()
  age!: number;

  @IsArray()
  @IsString({ each: true })
  medicalHistory!: string[];

  @IsOptional()
  @IsString()
  medications?: string;
}