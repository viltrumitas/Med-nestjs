import { ReviewEntity } from '../entities/review.entity';
import { ReviewResponseDto } from '../dto/review-response.dto';

import { TeacherResponseDto } from 'src/users/dto/teacher-response.dto';
import { StudentResponseDto } from 'src/users/dto/student-response.dto';

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

export class ReviewMapper {
  static toResponse(reviewEntity: ReviewEntity): ReviewResponseDto {
    const teacher = TeacherMapper.toResponse(reviewEntity.teacher);

    const assignedCase = reviewEntity.submission.assignedCase;

    const student = StudentMapper.toResponse(assignedCase.student);

    const anamnesis = reviewEntity.anamnesis as unknown as {
      sampler: SamplerDto;
      opqrst: OpqrstDto;
    };

    return {
      id: reviewEntity.id,

      caseId: reviewEntity.submission.assignedCase.case.id,

      teacher,
      student,

      case: CaseMapper.toResponse(assignedCase.case),

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
}