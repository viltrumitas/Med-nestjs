import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Matricula del usuario registrado',
    example: 202200008,
  })
  @IsNumber()
  matricula!: number;

  @ApiProperty({
    description: 'Contraseña de la cuenta',
    example: 'SecurePass123!',
  })
  @IsString()
  password!: string;
}
