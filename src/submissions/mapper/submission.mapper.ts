import { SubmissionResponseDto } from '../dto/submission-response.dto';
import { SubmissionSummaryResponseDto } from '../dto/submission-summary.dto';
import { SubmissionListEntity, SubmissionDetailEntity } from '../entities/submission.entity';

import { AssignmentMapper } from 'src/assignments/mapper/assignment.mapper';
import { CaseMapper } from 'src/cases/mappers/case.mapper';
import { StudentMapper } from 'src/users/mapper/student.mapper';

export class SubmissionMapper {

  static toResponse(
    submission: SubmissionDetailEntity,
  ): SubmissionResponseDto {
    return {
      id: submission.id,

      student: StudentMapper.toResponse(
        submission.assignedCase.student,
      ),

      assignment: AssignmentMapper.toResponse(
        submission.assignedCase.assignment,
      ),

      case: CaseMapper.toResponse(
        submission.assignedCase.case,
      ),

      reviewId: submission.review?.id ?? null,

      sceneManagement: submission.sceneManagement,
      sss: submission.sss,
      primaryTest: submission.primaryTest,
      sample: submission.sample,
      opqrst: submission.opqrst,
      presumptiveDiagnosis: submission.presumptiveDiagnosis,
      priority: submission.priority,
      transferDecision: submission.transferDecision,
      treatmentPlan: submission.treatmentPlan,
      reportPatient: submission.reportPatient,

      status: submission.status,

      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    };
  }

  static toSummary(
    submission: SubmissionListEntity,
  ): SubmissionSummaryResponseDto {
    return {
      id: submission.id,

      assignedCaseId: submission.assignedCaseId,

      student: StudentMapper.toSummaryStudent(
        submission.assignedCase.student,
      ),

      assignment: AssignmentMapper.toSummary(
        submission.assignedCase.assignment,
      ),

      case: CaseMapper.toSummary(
        submission.assignedCase.case,
      ),

      status: submission.status,

      reviewId: submission.review?.id,

      createdAt: submission.createdAt,
    };
  }
}