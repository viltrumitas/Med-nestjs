import { PartialType } from '@nestjs/swagger';
import { CreateMedicalAreaDto } from './create-medical-area.dto';

export class UpdateMedicalAreaDto extends PartialType(
  CreateMedicalAreaDto,
) {}