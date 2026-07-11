import { TeacherSummaryResponse } from 'src/users/dto/teacher-summary.dto';
import { AssignmentSummaryResponse } from 'src/assignments/dto/assignment-summary.dto';

export class ClassroomStudentResponse {

  id!: string;

  name!: string;

  description!: string | null;

  teacher!: TeacherSummaryResponse;

  assignments!: AssignmentSummaryResponse[];

  assignmentsCount!: number;

}