import { UserRole } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthorizedUserDto {
  @IsInt()
  matricula!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}