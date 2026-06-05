import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario con email y contraseña',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        role: 'STUDENT',
        createdAt: '2024-01-01T00:00:00Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validación fallida (email inválido, contraseña débil)',
  })
  @ApiConflictResponse({
    description: 'El email ya está registrado',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica usuario y retorna JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      example: {
        access_token: 'eyJhbGc...',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          role: 'STUDENT',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Credenciales inválidas',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // profile(@CurrentUser() user: JwtPayload) {
  //   return user;
  // }
}
