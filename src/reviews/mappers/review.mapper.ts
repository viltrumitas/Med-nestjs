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

    const assignedCase = reviewEntity.submission.assignedCase;

    const student: StudentResponseDto = {
      id: assignedCase.student.id,
      matricula: assignedCase.student.matricula,
      firstName: assignedCase.student.firstName,
      lastName: assignedCase.student.lastName,
      role: assignedCase.student.role,
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

      case: {
        ...assignedCase.case,
        teacher: assignedCase.case.author,
      },

      assignment: {
        ...assignedCase.assignment,
        teacher: assignedCase.assignment.teacher,
      },


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
}