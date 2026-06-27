import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsBoolean()
  isPublished!: boolean;
}