import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty({
    description: 'ID único del profesor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Email del profesor',
    example: 'profesor@med.edu',
  })
  email!: string;

  @ApiProperty({
    description: 'Primer nombre del profesor',
    example: 'María',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Apellido del profesor',
    example: 'López',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['ADMIN', 'TEACHER', 'STUDENT'],
    example: 'TEACHER',
  })
  role!: string;
}
