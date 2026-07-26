import { IsInt, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Matricula del usuario',
    example: 202200008,
  })
  @IsNumber()
  matricula!: number;

  @ApiProperty({
    description: 'Contraseña (mínimo 8, máximo 100 caracteres)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(100, {
    message: 'La contraseña no puede superar los 100 caracteres.',
  })
  password!: string;
}
