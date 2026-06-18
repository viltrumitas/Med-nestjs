import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { GeneralInfoDto } from './general-info.dto';
import { PatientDto } from './patient.dto';
import { GeneralFindingsDto } from './general-findings.dto';
import { VitalSignsDto } from './vital-signs.dto';
import { NeurologicalDto } from './neurological.dto';
import { PublishCaseDto } from './publish.dto';

export class CreateCaseDto {
  @ValidateNested()
  @Type(() => GeneralInfoDto)
  general!: GeneralInfoDto;

  @ValidateNested()
  @Type(() => PatientDto)
  patient!: PatientDto;

  @ValidateNested()
  @Type(() => GeneralFindingsDto)
  findings!: GeneralFindingsDto;

  @ValidateNested()
  @Type(() => VitalSignsDto)
  vitalSigns!: VitalSignsDto;

  @ValidateNested()
  @Type(() => NeurologicalDto)
  neurological!: NeurologicalDto;

  @ValidateNested()
  @Type(() => PublishCaseDto)
  publishCase!: PublishCaseDto;

  @IsOptional()
  @IsString()
  feedback?: string;
}