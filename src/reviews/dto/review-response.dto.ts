import { ApiProperty } from '@nestjs/swagger';
import { TeacherResponseDto } from './teacher-response.dto';

export class ReviewResponseDto {
  @ApiProperty({
    description: 'ID único de la evaluación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del profesor que realizó la evaluación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  teacherId!: string;

  @ApiProperty({
    description: 'Retroalimentación y evaluación',
    example:
      'Buen análisis clínico. Considera agregar diagnósticos diferenciales. Calificación: 8.5/10',
  })
  feedback!: string;

  @ApiProperty({
    description: 'Información del profesor que realizó la evaluación',
    type: TeacherResponseDto,
  })
  teacher!: TeacherResponseDto;
}
