import { IsString, Length } from "class-validator";

export class JoinClassroomDto {
  @IsString()
  @Length(6, 8)
  code!: string;
}