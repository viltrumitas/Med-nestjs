import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true})
  caseIds!: string[];

  @IsBoolean()
  isPublished!: boolean;
}