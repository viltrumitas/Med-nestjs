import { IsArray, ArrayNotEmpty, IsString } from "class-validator";

export class AssignRandomDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  studentsIds!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  caseIds!: string[];
}