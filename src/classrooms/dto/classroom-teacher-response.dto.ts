import { TeacherSummaryResponse } from 'src/users/dto/teacher-summary.dto';
import { AssignmentSummaryResponse } from 'src/assignments/dto/assignment-summary.dto';
import { StudentSummaryResponse } from 'src/users/dto/student-summary.dto';

export class ClassroomTeacherResponse {

  id!: string;

  name!: string;

  description!: string | null;

  code!: string;

  isActive!: boolean;

  teacher!: TeacherSummaryResponse;

  studentsCount!: number;

  assignmentsCount!: number;

  assignments!: AssignmentSummaryResponse[];

  students!: StudentSummaryResponse[];

  createdAt!: Date;

  updatedAt!: Date;
}