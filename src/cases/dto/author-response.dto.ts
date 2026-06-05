import { ApiProperty } from '@nestjs/swagger';

export class AuthorResponseDto {
  @ApiProperty({
    description: 'ID único del autor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Email del autor',
    example: 'estudiante@med.edu',
  })
  email!: string;

  @ApiProperty({
    description: 'Primer nombre del autor',
    example: 'Juan',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Apellido del autor',
    example: 'García',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['ADMIN', 'TEACHER', 'STUDENT'],
    example: 'STUDENT',
  })
  role!: string;
}
