import { IsBoolean, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateClassroomDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}