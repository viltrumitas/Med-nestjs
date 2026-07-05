import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

import type { JwtPayload } from 'src/common/types/jwt-payload.type';

@ApiTags('Users')
@ApiBearerAuth('access_token')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  // =========================
  // MY PROFILE
  // =========================
  @Get('me')
  getProfile(
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.getProfile(user.sub);
  }

  // =========================
  // TEACHERS
  // =========================
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('teachers')
  findTeachers() {
    return this.usersService.findTeachers();
  }

  // =========================
  // STUDENTS
  // =========================
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('students')
  findStudents() {
    return this.usersService.findStudents();
  }
}