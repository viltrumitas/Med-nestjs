import { Assignment } from "@prisma/client";

import {
  AssignmentDetailEntity,
  AssignmentListEntity,
} from "../entities/assignment.entity";

import { AssignmentResponseDto } from "../dto/assignment-response.dto";
import { AssignmentDetailResponseDto } from "../dto/assignment-detail-response.dto";
import { AssignmentSummaryResponse } from "../dto/assignment-summary.dto";

import { AssignedCaseMapper } from "../../assigned-case/mapper/assigned-case.mapper";
import { CaseMapper } from "src/cases/mappers/case.mapper";
import { ClassroomMapper } from "src/classrooms/mappers/classroom-mapper";

export class AssignmentMapper {
  static toResponse(
    assignment: AssignmentListEntity,
  ): AssignmentResponseDto {
    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,

      classroom: ClassroomMapper.toSummary(
        assignment.classroom,
      ),

      isPublished: assignment.isPublished,

      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    };
  }

  static toDetailResponse(
    assignment: AssignmentDetailEntity,
  ): AssignmentDetailResponseDto {
    return {
      ...this.toResponse(assignment),

      cases: assignment.cases.map((c) =>
        CaseMapper.toSummary(c.case),
      ),

      assignedCases: assignment.assignedCases.map((assignedCase) =>
        AssignedCaseMapper.toAssignmentSummary(assignedCase),
      ),
    };
  }

  static toSummary(
    assignment: Assignment,
  ): AssignmentSummaryResponse {
    return {
      id: assignment.id,
      title: assignment.title,
      isPublished: assignment.isPublished,
    };
  }
}