import { AssignmentMapper } from '../../assignments/mapper/assignment.mapper';
import { CaseMapper } from '../../cases/mappers/case.mapper';
import { StudentMapper } from 'src/users/mapper/student.mapper';

import { AssignedCaseListEntity } from '../entities/assigned-case.entity';
import { AssignedCaseResponseDto } from '../dto/assigned-case-response.dto';

import { AssignmentAssignedCaseEntity } from 'src/assignments/entities/assignment.entity';
import { AssignmentAssignedCaseResponseDto } from 'src/assignments/dto/assignment-assigned-case.dto';

import { AssignedCaseSummaryResponseDto } from '../dto/assigned-case-summary.dto';
import { AssignmentAssignedCaseSummaryDto } from 'src/assignments/dto/assignment-assigned-case-summary.dto';
import { AssignmentAssignedCaseSummaryEntity } from '../entities/assigned-case.entity';

export class AssignedCaseMapper {

  private static mapSubmission(submission: any) {
    if (!submission) return null;

    return {
      id: submission.id,
      status: submission.status,
      reviewId: submission.review?.id ?? null,
    };
  }

  static toResponse(assignedCase: AssignedCaseListEntity): AssignedCaseResponseDto {
    return {
      id: assignedCase.id,

      assignment: AssignmentMapper.toResponse(assignedCase.assignment),
      case: CaseMapper.toResponse(assignedCase.case),

      submission: this.mapSubmission(assignedCase.submission),

      assignedAt: assignedCase.assignedAt,
    };
  }

  static toAssignmentResponse(
    assignedCase: AssignmentAssignedCaseEntity,
  ): AssignmentAssignedCaseResponseDto {
    return {
      id: assignedCase.id,

      student: StudentMapper.toResponse(assignedCase.student),
      case: CaseMapper.toResponse(assignedCase.case),

      submission: this.mapSubmission(assignedCase.submission),

      assignedAt: assignedCase.assignedAt,
    };
  }

  static toAssignmentSummary(
    assignedCase: AssignmentAssignedCaseSummaryEntity,
  ): AssignmentAssignedCaseSummaryDto {
    return {
      id: assignedCase.id,

      student: StudentMapper.toSummaryStudent(assignedCase.student),
      case: CaseMapper.toSummary(assignedCase.case),

      submission: this.mapSubmission(assignedCase.submission),

      assignedAt: assignedCase.assignedAt,
    };
  }

  static toSummary(assignedCase: AssignedCaseListEntity): AssignedCaseSummaryResponseDto {
    return {
      id: assignedCase.id,

      assignment: AssignmentMapper.toSummary(assignedCase.assignment),
      case: CaseMapper.toSummary(assignedCase.case),

      submission: this.mapSubmission(assignedCase.submission),

      assignedAt: assignedCase.assignedAt,
    };
  }
}