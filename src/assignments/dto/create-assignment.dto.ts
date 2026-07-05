import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  title!: string;

  @IsUUID()
  classroomId!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true})
  caseIds!: string[];
}