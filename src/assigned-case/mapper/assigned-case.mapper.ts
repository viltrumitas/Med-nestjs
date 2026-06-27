import { AssignmentMapper } from '../../assignments/mapper/assignment.mapper';
import { CaseMapper } from '../../cases/mappers/case.mapper';

import { AssignedCaseListEntity } from '../entities/assigned-case.entity';
import { AssignedCaseResponseDto } from '../dto/assigned-case-response.dto';

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
}