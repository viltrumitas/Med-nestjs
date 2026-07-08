import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Patch,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserRole } from '@prisma/client';

import { ClassroomsService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../common/types/jwt-payload.type';
import { CreateAssignmentDto } from 'src/assignments/dto/create-assignment.dto';

@ApiTags('Classrooms')
@ApiBearerAuth('access_token')
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) { }

  // =========================
  // CREATE CLASSROOM (TEACHER)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post()
  @ApiOperation({ summary: 'Crear classroom' })
  create(
    @Body() dto: CreateClassroomDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.create(dto, user.sub);
  }

  // =========================
  // CREATE
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post(':id/assignments')
  @ApiOperation({
    summary: 'Crear actividad',
  })
  createAssignment(
    @Param('id', ParseUUIDPipe) classroomId: string,
    @Body() dto: CreateAssignmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.createAssignment(classroomId, dto, user.sub);
  }

  // =========================
  // JOIN CLASSROOM (STUDENT)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post('join')
  @ApiOperation({ summary: 'Unirse a classroom por código' })
  join(
    @Body() dto: JoinClassroomDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.joinByCode(dto.code, user.sub);
  }

  // =========================
  // MY CLASSROOMS (TEACHER)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my')
  @ApiOperation({ summary: 'Mis classrooms (teacher)' })
  findMyClassrooms(@CurrentUser() user: JwtPayload) {
    return this.classroomsService.findMyClassrooms(user.sub);
  }

  // =========================
  // GET DETAIL CLASSROOM
  // (TEACHER / STUDENT)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.STUDENT)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener classroom por ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.findOne(id, user.sub);
  }

  // =========================
  // UPDATE CLASSROOM (TEACHER)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar classroom' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassroomDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.update(id, user.sub, dto);
  }

  // =========================
  // DELETE CLASSROOM (TEACHER)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar classroom' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.delete(id, user.sub);
  }

  // =========================
  // GET STUDENTS (TEACHER)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get(':id/students')
  @ApiOperation({ summary: 'Listar estudiantes del classroom' })
  getStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.classroomsService.getStudents(id, user.sub);
  }
}