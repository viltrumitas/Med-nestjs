import { AssignmentMapper } from '../../assignments/mapper/assignment.mapper';
import { CaseMapper } from '../../cases/mappers/case.mapper';
import { StudentMapper } from 'src/users/mapper/student.mapper';

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

      submission: assignedCase.submission
        ? {
          id: assignedCase.submission.id,
          status: assignedCase.submission.status,
        }
        : null,

      assignedAt: assignedCase.assignedAt,
    };
  }

  static toAssignmentResponse(
    assignedCase: AssignmentAssignedCaseEntity,
  ): AssignmentAssignedCaseResponseDto {
    return {
      id: assignedCase.id,

      student: StudentMapper.toResponse(assignedCase.student),

      case: CaseMapper.toResponse(
        assignedCase.case,
      ),

      submission: assignedCase.submission
        ? {
          id: assignedCase.submission.id,
          status: assignedCase.submission.status,
        }
        : null,

      assignedAt: assignedCase.assignedAt,
    };
  }
}