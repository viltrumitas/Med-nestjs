import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class TeacherResponseDto {
  @ApiProperty({
    description: 'ID único del autor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Matricula del autor',
    example: 202200008,
  })
  matricula!: number;

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
    enum: UserRole,
    example: 'STUDENT',
  })
  role!: UserRole;
}
