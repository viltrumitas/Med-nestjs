import { ApiProperty } from '@nestjs/swagger';
import { AuthorResponseDto } from './author-response.dto';

export class CaseResponseDto {
  @ApiProperty({
    description: 'ID único del caso',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Título del caso clínico',
    example: 'Paciente con síntomas de diabetes tipo 2',
  })
  title!: string;

  @ApiProperty({
    description: 'Descripción detallada del caso',
    example:
      'Paciente masculino de 45 años presenta hiperglucemia y síntomas...',
  })
  description!: string;

  @ApiProperty({
    description: 'Estado del caso',
    enum: ['DRAFT', 'SUBMITTED', 'EVALUATED'],
    example: 'SUBMITTED',
  })
  status!: string;

  @ApiProperty({
    description: 'Información del autor del caso',
    type: AuthorResponseDto,
  })
  author!: AuthorResponseDto;
}
