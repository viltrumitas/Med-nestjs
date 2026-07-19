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
    description: 'Contraseña (mínimo 6, máximo 100 caracteres)',
    example: 'SecurePass123!',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;
}
