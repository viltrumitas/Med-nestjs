import { TeacherResponseDto } from "src/users/dto/teacher-response.dto";
import { TeacherSummaryResponse } from "src/users/dto/teacher-summary.dto";

export class ClassroomResponseDto {
  id!: string;

  name!: string;

  description!: string | null;

  code!: string;

  teacher!: TeacherSummaryResponse;

  isActive!: boolean;

  studentsCount!: number;

  assignmentsCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}