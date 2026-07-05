import { AssignmentDetailEntity, AssignmentListEntity } from "../entities/assignment.entity";
import { AssignmentResponseDto } from "../dto/assignment-response.dto";
import { AssignmentDetailResponseDto } from "../dto/assignment-detail-response.dto";
import { AssignedCaseMapper } from "../../assigned-case/mapper/assigned-case.mapper";
import { CaseMapper } from "src/cases/mappers/case.mapper";
import { ClassroomMapper } from "src/classrooms/mappers/classroom-mapper";

export class AssignmentMapper {
  static toResponse(
    assignmentEntity: AssignmentListEntity,
  ): AssignmentResponseDto {
    return {
      id: assignmentEntity.id,
      title: assignmentEntity.title,
      description: assignmentEntity.description,

      classroom: ClassroomMapper.toSummary(assignmentEntity.classroom),

      isPublished: assignmentEntity.isPublished,

      createdAt: assignmentEntity.createdAt,
      updatedAt: assignmentEntity.updatedAt,
    }
  }

  static toDetailResponse(
    assignment: AssignmentDetailEntity,
  ): AssignmentDetailResponseDto {
    return {
      ...this.toResponse(assignment),

      cases: assignment.cases.map((c) => CaseMapper.toResponse(c.case)),
      
      assignedCases: assignment.assignedCases.map((assignedCase) =>
        AssignedCaseMapper.toAssignmentResponse(assignedCase),
      ),
    };
  }
}