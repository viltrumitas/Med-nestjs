import { SubmissionResponseDto } from "../dto/submission-response.dto";
import { StudentResponseDto } from "../dto/student-response.dto";
import { SubmissionEntity } from "../entities/submission.entity";

export class SubmissionMapper {
  static toResponse(submissionEntity: SubmissionEntity): SubmissionResponseDto {
    const student: StudentResponseDto = {
      id: submissionEntity.student.id,
      matricula: submissionEntity.student.matricula,
      firstName: submissionEntity.student.firstName,
      lastName: submissionEntity.student.lastName,
      role: submissionEntity.student.role,
    };

    return {
      id: submissionEntity.id,

      student,
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