import { AssignmentDetailEntity, AssignmentListEntity } from "../entities/assignment.entity";
import { AssignmentResponseDto } from "../dto/assignment-response.dto";
import { TeacherResponseDto } from "../../cases/dto/teacher-response.dto";
import { AssignmentDetailResponseDto } from "../dto/assignment-detail-response.dto";
import { AssignedCaseMapper } from "../../assigned-case/mapper/assigned-case.mapper";

export class AssignmentMapper {
  static toResponse(
    assignmentEntity: AssignmentListEntity,
  ): AssignmentResponseDto {
    const teacher: TeacherResponseDto = {
      id: assignmentEntity.teacher.id,
      matricula: assignmentEntity.teacher.matricula,
      firstName: assignmentEntity.teacher.firstName,
      lastName: assignmentEntity.teacher.lastName,
      role: assignmentEntity.teacher.role,
    };

    return {
      id: assignmentEntity.id,
      title: assignmentEntity.title,
      description: assignmentEntity.description,
      teacher,
      isPublished: assignmentEntity.isPublished,
      createdAt: assignmentEntity.createdAt,
      updatedAt: assignmentEntity.updatedAt,
    };
  }

  static toDetailResponse(
    assignment: AssignmentDetailEntity,
  ): AssignmentDetailResponseDto {
    return {
      ...this.toResponse(assignment),

      assignedCases: assignment.assignedCases.map((assignedCase) =>
        AssignedCaseMapper.toAssignmentResponse(assignedCase),
      ),
    };
  }
}