import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID del caso a evaluar',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  caseId!: string;

  @ApiProperty({
    description: 'Retroalimentación y evaluación del profesor',
    example:
      'Buen análisis clínico. Considera agregar diagnósticos diferenciales. Calificación: 8.5/10',
  })
  @IsString()
  feedback!: string;
}
