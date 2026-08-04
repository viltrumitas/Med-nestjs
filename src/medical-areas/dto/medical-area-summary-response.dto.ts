import { ApiProperty } from '@nestjs/swagger';

export class MedicalAreaSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}