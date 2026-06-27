import { ReviewEntity } from '../entities/review.entity';
import { ReviewResponseDto } from '../dto/review-response.dto';

import { TeacherResponseDto } from 'src/cases/dto/teacher-response.dto';
import { StudentResponseDto } from 'src/submissions/dto/student-response.dto';

import { SceneManagementDto } from '../dto/sceneManagment.dto';
import { PrimaryAssessmentDto } from '../dto/primaryAssessment.dto';
import { PatientPriority } from '../dto/patientPriority.dto';
import { VitalSignsDto } from '../dto/vitalSigns.dto';
import { FocusedAssessmentDto } from '../dto/focusedAssessment.dto';
import { PhysicalExaminationDto } from '../dto/physicalExamination.dto';
import { OpqrstDto, SamplerDto } from '../dto/anamnesis.dto';
import { OtherInterventionsDto } from '../dto/otherInterventions.dto';

export class ReviewMapper {
  static toResponse(reviewEntity: ReviewEntity): ReviewResponseDto {
    const teacher: TeacherResponseDto = {
      id: reviewEntity.teacher.id,
      matricula: reviewEntity.teacher.matricula,
      firstName: reviewEntity.teacher.firstName,
      lastName: reviewEntity.teacher.lastName,
      role: reviewEntity.teacher.role,
    };

    const student: StudentResponseDto = {
      id: reviewEntity.submission.assignedCase.student.id,
      matricula: reviewEntity.submission.assignedCase.student.matricula,
      firstName: reviewEntity.submission.assignedCase.student.firstName,
      lastName: reviewEntity.submission.assignedCase.student.lastName,
      role: reviewEntity.submission.assignedCase.student.role,
    };

    const anamnesis = reviewEntity.anamnesis as unknown as {
      sampler: SamplerDto;
      opqrst: OpqrstDto;
    };

    return {
      id: reviewEntity.id,

      caseId: reviewEntity.submission.assignedCase.case.id,

      teacher,
      student,

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
      feedback: reviewEntity.feedback ?? '',

      createdAt: reviewEntity.createdAt,
    };
  }
}