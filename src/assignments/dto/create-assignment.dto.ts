import { LateSubmissionPolicy } from "@prisma/client";
import { ArrayMinSize, IsArray, IsDateString, IsOptional, IsString, IsEnum } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  caseIds!: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(LateSubmissionPolicy)
  lateSubmissionPolicy?: LateSubmissionPolicy;
}