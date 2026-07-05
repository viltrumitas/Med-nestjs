import { TeacherResponseDto } from "src/users/dto/teacher-response.dto";

export class ClassroomResponseDto {
  id!: string;

  name!: string;

  description!: string | null;

  code!: string;

  teacher!: TeacherResponseDto;

  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}