import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseDto {
  @ApiProperty({
    description: 'Título del caso clínico',
    example: 'Paciente con síntomas de diabetes tipo 2',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Descripción detallada del caso (opcional)',
    example:
      'Paciente masculino de 45 años presenta hiperglucemia y síntomas...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description!: string;
}
