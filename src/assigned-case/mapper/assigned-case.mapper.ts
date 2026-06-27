import { AssignmentMapper } from '../../assignments/mapper/assignment.mapper';
import { CaseMapper } from '../../cases/mappers/case.mapper';

import { AssignedCaseListEntity } from '../entities/assigned-case.entity';
import { AssignedCaseResponseDto } from '../dto/assigned-case-response.dto';

import { AssignmentAssignedCaseEntity } from 'src/assignments/entities/assignment.entity';
import { AssignmentAssignedCaseResponseDto } from 'src/assignments/dto/assignment-assigned-case.dto';

export class AssignedCaseMapper {
  static toResponse(
    assignedCase: AssignedCaseListEntity,
  ): AssignedCaseResponseDto {
    return {
      id: assignedCase.id,

      assignment: AssignmentMapper.toResponse(
        assignedCase.assignment,
      ),

      case: CaseMapper.toResponse(
        assignedCase.case,
      ),

      submissionId: assignedCase.submission
        ? assignedCase.submission.id
        : null,

      assignedAt: assignedCase.assignedAt,
    };
  }

  static toAssignmentResponse(
    assignedCase: AssignmentAssignedCaseEntity,
  ): AssignmentAssignedCaseResponseDto {
    return {
      id: assignedCase.id,

      student: {
        id: assignedCase.student.id,
        matricula: assignedCase.student.matricula,
        firstName: assignedCase.student.firstName,
        lastName: assignedCase.student.lastName,
        role: assignedCase.student.role,
      },

      case: CaseMapper.toResponse(
        assignedCase.case,
      ),

      submissionId: assignedCase.submission?.id ?? null,

      assignedAt: assignedCase.assignedAt,
    };
  }
}