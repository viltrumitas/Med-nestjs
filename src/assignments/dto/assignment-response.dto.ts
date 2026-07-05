import { ClassroomSummaryResponseDto } from "../../classrooms/dto/assignment-summary-response.dto";

export class AssignmentResponseDto {
  id!: string;
  title!: string;
  description!: string | null;

  classroom!: ClassroomSummaryResponseDto;

  isPublished!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
