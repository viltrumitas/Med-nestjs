import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

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
}