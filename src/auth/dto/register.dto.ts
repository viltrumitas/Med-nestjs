import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'estudiante@med.edu',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 6, máximo 100 caracteres)',
    example: 'SecurePass123!',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @ApiProperty({
    description: 'Primer nombre (mínimo 2, máximo 50 caracteres)',
    example: 'Juan',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({
    description: 'Apellido (mínimo 2, máximo 50 caracteres)',
    example: 'García',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;
}
