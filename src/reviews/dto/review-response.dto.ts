import { TeacherResponseDto } from "src/cases/dto/teacher-response.dto";
import { StudentResponseDto } from "src/submissions/dto/student-response.dto";
import { SceneManagementDto } from "./sceneManagment.dto";
import { PrimaryAssessmentDto } from "./primaryAssessment.dto";
import { PatientPriority } from "./patientPriority.dto";
import { VitalSignsDto } from "./vitalSigns.dto";
import { FocusedAssessmentDto } from "./focusedAssessment.dto";
import { PhysicalExaminationDto } from "./physicalExamination.dto";
import { SamplerDto } from "./anamnesis.dto";
import { OpqrstDto } from "./anamnesis.dto";
import { OtherInterventionsDto } from "./otherInterventions.dto";
import { CaseResponseDto } from "src/cases/dto/case-response.dto";
import { AssignmentResponseDto } from "src/assignments/dto/assignment-response.dto";


export class ReviewResponseDto {
  id!: string;
  caseId!: string;

  teacher!: TeacherResponseDto;
  student!: StudentResponseDto;

  case!: CaseResponseDto;

  assignment!: AssignmentResponseDto;

  sceneManagement!: SceneManagementDto;

  primaryAssessment!: PrimaryAssessmentDto;

  patientPriority!: PatientPriority

  vitalSigns!: VitalSignsDto

  focusedAssessment!: FocusedAssessmentDto

  physicalExamination!: PhysicalExaminationDto

  sampler!: SamplerDto

  opqrst!: OpqrstDto

  otherInterventions!: OtherInterventionsDto;

  totalScore!: number;

  feedback?: string | null;

  createdAt!: Date;
}