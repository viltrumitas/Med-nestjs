import { ClassroomResponseDto } from "./classroom-response.dto";
import { AssignmentSummaryResponse } from "src/assignments/dto/assignment-summary.dto";
import { StudentResponseDto } from "src/users/dto/student-response.dto";

export class ClassroomDetailResponseDto extends ClassroomResponseDto {
  assignments!: AssignmentSummaryResponse[];
  students!: StudentResponseDto[]
}