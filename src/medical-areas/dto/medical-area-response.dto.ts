import { ApiProperty } from '@nestjs/swagger';

export class MedicalAreaResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  casesCount!: number;

  @ApiProperty()
  canDelete!: boolean;

  @ApiProperty()
  updatedAt!: Date;
}