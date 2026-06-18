import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { SceneManagementDto } from "./sceneManagment.dto";
import { PrimaryAssessmentDto } from "./primaryAssessment.dto";
import { VitalSignsDto } from "./vitalSigns.dto";
import { FocusedAssessmentDto } from "./focusedAssessment.dto";
import { PhysicalExaminationDto } from "./physicalExamination.dto";
import { OpqrstDto, SamplerDto } from "./anamnesis.dto";
import { OtherInterventionsDto } from "./otherInterventions.dto";
import { PatientPriority } from "./patientPriority.dto";

export class CreateReviewDto {
  @ValidateNested()
  @Type(() => SceneManagementDto)
  sceneManagement!: SceneManagementDto;

  @ValidateNested()
  @Type(() => PrimaryAssessmentDto)
  primaryAssessment!: PrimaryAssessmentDto

  @ValidateNested()
  @Type(() => PatientPriority)
  patientPriority!: PatientPriority
  
  @ValidateNested()
  @Type(() => VitalSignsDto)
  vitalSigns!: VitalSignsDto

  @ValidateNested()
  @Type(() => FocusedAssessmentDto)
  focusedAssessment!: FocusedAssessmentDto

  @ValidateNested()
  @Type(() => PhysicalExaminationDto)
  physicalExamination!: PhysicalExaminationDto

  @ValidateNested()
  @Type(() => SamplerDto)
  sampler!: SamplerDto

  @ValidateNested()
  @Type(() => OpqrstDto)
  opqrst!: OpqrstDto

  @ValidateNested()
  @Type(() => OtherInterventionsDto)
  otherInterventions!: OtherInterventionsDto

  @IsOptional()
  @IsString()
  feedback?: string;
}