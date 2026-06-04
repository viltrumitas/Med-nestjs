import { TeacherResponseDto } from './teacher-response.dto';

export class ReviewResponseDto {
  id!: string;
  teacherId!: string;
  feedback!: string;
  teacher!: TeacherResponseDto;
}
