import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario registrado',
    example: 'estudiante@med.edu',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña de la cuenta',
    example: 'SecurePass123!',
  })
  @IsString()
  password!: string;
}
