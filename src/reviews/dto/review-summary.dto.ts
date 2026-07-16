import { AssignmentSummaryResponse } from "src/assignments/dto/assignment-summary.dto";
import { CaseSummaryResponseDto } from "src/cases/dto/case-summary.dto";
import { StudentSummaryResponse } from "src/users/dto/student-summary.dto";
import { TeacherSummaryResponse } from "src/users/dto/teacher-summary.dto";

export class ReviewSummaryResponseDto {
  id!: string;
  totalScore!: number;
  teacher!: TeacherSummaryResponse;
  student!: StudentSummaryResponse;
  assignment!: AssignmentSummaryResponse;
  case!: CaseSummaryResponseDto;
  createdAt!: Date;
}