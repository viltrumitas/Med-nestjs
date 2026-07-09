import { ClassroomResponseDto } from "./classroom-response.dto";
import { AssignmentSummaryResponse } from "src/assignments/dto/assignment-summary.dto";
import { StudentResponseDto } from "src/users/dto/student-response.dto";
import { StudentSummaryResponse } from "src/users/dto/student-summary.dto";

export class ClassroomDetailResponseDto extends ClassroomResponseDto {
  assignments!: AssignmentSummaryResponse[];
  students!: StudentSummaryResponse[]
}