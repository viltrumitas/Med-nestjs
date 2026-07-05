import { TeacherResponseDto } from "src/users/dto/teacher-response.dto";

export class ClassroomResponseDto {
  id!: string;

  name!: string;

  description!: string | null;

  code!: string;

  teacher!: TeacherResponseDto;

  isActive!: boolean;

  studentsCount!: number;

  assignmentsCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}