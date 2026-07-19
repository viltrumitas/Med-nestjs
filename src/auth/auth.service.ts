import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from '@prisma/client';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByMatricula(dto.matricula);

    if (existingUser) {
      throw new ConflictException('Esa matricula ya existe');
    }

    const authorizedUser = await this.usersService.findAuthorizedUser(dto.matricula);

    if (!authorizedUser) {
      throw new UnauthorizedException(
        `La matricula no pertenece a la institucion`
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      matricula: authorizedUser.matricula,
      firstName: authorizedUser.firstName,
      lastName: authorizedUser.lastName,
      password: hashedPassword,
      role: authorizedUser.role,
    });

    const payload: JwtPayload = {
      sub: user.id,
      matricula: user.matricula,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: AuthMapper.toUserResponse(user)
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByMatricula(dto.matricula);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      matricula: user.matricula,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: AuthMapper.toUserResponse(user),
    };
  }
}
