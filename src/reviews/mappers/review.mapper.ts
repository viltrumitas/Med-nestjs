import { ReviewDetailEntity, ReviewListEntity } from '../entities/review.entity';
import { ReviewResponseDto } from '../dto/review-response.dto';
import { SceneManagementDto } from '../dto/sceneManagment.dto';
import { PrimaryAssessmentDto } from '../dto/primaryAssessment.dto';
import { PatientPriority } from '../dto/patientPriority.dto';
import { VitalSignsDto } from '../dto/vitalSigns.dto';
import { FocusedAssessmentDto } from '../dto/focusedAssessment.dto';
import { PhysicalExaminationDto } from '../dto/physicalExamination.dto';
import { OpqrstDto, SamplerDto } from '../dto/anamnesis.dto';
import { OtherInterventionsDto } from '../dto/otherInterventions.dto';
import { TeacherMapper } from 'src/users/mapper/teacher.mapper';
import { StudentMapper } from 'src/users/mapper/student.mapper';
import { AssignmentMapper } from 'src/assignments/mapper/assignment.mapper';
import { CaseMapper } from 'src/cases/mappers/case.mapper';
import { ReviewSummaryResponseDto } from '../dto/review-summary.dto';
import { SubmissionMapper } from 'src/submissions/mapper/submission.mapper';

export class ReviewMapper {
  static toResponse(reviewEntity: ReviewDetailEntity): ReviewResponseDto {
    const teacher = TeacherMapper.toResponse(reviewEntity.teacher);

    const submission = reviewEntity.submission;

    const assignedCase = reviewEntity.submission.assignedCase;

    const student = StudentMapper.toResponse(assignedCase.student);

    const anamnesis = reviewEntity.anamnesis as unknown as {
      sampler: SamplerDto;
      opqrst: OpqrstDto;
    };

    return {
      id: reviewEntity.id,

      caseId: assignedCase.case.id,

      teacher,
      student,

      case: CaseMapper.toResponse(assignedCase.case),

      submission: SubmissionMapper.toResponse(submission),

      assignment: AssignmentMapper.toResponse(assignedCase.assignment),


      sceneManagement: reviewEntity.sceneManagement as unknown as SceneManagementDto,
      primaryAssessment: reviewEntity.primaryAssessment as unknown as PrimaryAssessmentDto,
      patientPriority: reviewEntity.patientPriority as unknown as PatientPriority,
      vitalSigns: reviewEntity.vitalSigns as unknown as VitalSignsDto,
      focusedAssessment: reviewEntity.focusedAssessment as unknown as FocusedAssessmentDto,
      physicalExamination: reviewEntity.physicalExamination as unknown as PhysicalExaminationDto,

      sampler: anamnesis.sampler,
      opqrst: anamnesis.opqrst,

      otherInterventions:
        reviewEntity.otherInterventions as unknown as OtherInterventionsDto,

      totalScore: reviewEntity.totalScore,
      feedback: reviewEntity.feedback ?? null,

      createdAt: reviewEntity.createdAt,
    };
  }

  static toSummary(review: ReviewListEntity): ReviewSummaryResponseDto {
    const assignedCase = review.submission.assignedCase;

    return {
      id: review.id,
      totalScore: review.totalScore,

      teacher: TeacherMapper.toSummaryTeacher(review.teacher),

      student: StudentMapper.toSummaryStudent(assignedCase.student),

      assignment: {
        id: assignedCase.assignment.id,
        title: assignedCase.assignment.title,
        isPublished: assignedCase.assignment.isPublished,
      },

      case: {
        id: assignedCase.case.id,
        title: assignedCase.case.title ?? '',
        consult: assignedCase.case.consult,
        isPublished: assignedCase.case.isPublished,
        createdAt: assignedCase.case.createdAt,
      },

      createdAt: review.createdAt,
    };
  }
}