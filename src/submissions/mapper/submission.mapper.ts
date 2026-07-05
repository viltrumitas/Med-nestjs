import { SubmissionResponseDto } from "../dto/submission-response.dto";
import { StudentResponseDto } from "src/users/dto/student-response.dto";
import { SubmissionEntity } from "../entities/submission.entity";
import { AssignmentMapper } from "src/assignments/mapper/assignment.mapper";
import { CaseMapper } from "src/cases/mappers/case.mapper";
import { StudentMapper } from "src/users/mapper/student.mapper";

export class SubmissionMapper {
  static toResponse(submissionEntity: SubmissionEntity): SubmissionResponseDto {
    const student = StudentMapper.toResponse(submissionEntity.assignedCase.student);

    return {
      id: submissionEntity.id,

      student,

      assignment: AssignmentMapper.toResponse(submissionEntity.assignedCase.assignment),
      case: CaseMapper.toResponse(submissionEntity.assignedCase.case),

      reviewId: submissionEntity.review?.id ?? null,

      sceneManagement: submissionEntity.sceneManagement,
      sss: submissionEntity.sss,
      primaryTest: submissionEntity.primaryTest,
      sample: submissionEntity.sample,
      opqrst: submissionEntity.opqrst,
      presumptiveDiagnosis: submissionEntity.presumptiveDiagnosis,
      priority: submissionEntity.priority,
      transferDecision: submissionEntity.transferDecision,
      treatmentPlan: submissionEntity.treatmentPlan,
      reportPatient: submissionEntity.reportPatient,
      status: submissionEntity.status,

      createdAt: submissionEntity.createdAt,
      updatedAt: submissionEntity.updatedAt,
    };
  }
}