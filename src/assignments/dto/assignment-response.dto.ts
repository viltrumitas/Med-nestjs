import { TeacherResponseDto } from "../../cases/dto/teacher-response.dto";

export class AssignmentResponseDto {
  id!: string;
  title!: string;
  description!: string | null;
  
  teacher!: TeacherResponseDto | null;
  isPublished!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}