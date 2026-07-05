import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserRole } from '@prisma/client';

import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import type { JwtPayload } from 'src/common/types/jwt-payload.type';

@ApiTags('Assignments')
@ApiBearerAuth('access_token')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  // =========================
  // CREATE
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post()
  @ApiOperation({
    summary: 'Crear actividad',
  })
  create(
    @Body() dto: CreateAssignmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.assignmentsService.create(dto, user.sub);
  }

  // =========================
  // MY ASSIGNMENTS
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my')
  @ApiOperation({
    summary: 'Listar mis actividades'
  })
  findMyAssignments(@CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findMyAssignments(user.sub);
  }

  // =========================
  // MY PUBLISHED CASES (CASOS DISPONIBLES)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my/published-cases')
  @ApiOperation({
    summary: 'Listar mis casos publicados'
  })
  findMyPublishedCases(@CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findMyPublishedCases(user.sub);
  }

  // =========================
  // GET BY ID
  // =========================
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.TEACHER)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una actividad por id'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findOne(id, user.sub);
  }

  // =========================
  // PUBLISH
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id/publish')
  @ApiOperation({
    summary: 'Publicar actividad'
  })
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.assignmentsService.publish(id, user.sub);
  }

  // ========================
  // UNPUBLISH

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id/unpublish')
  @ApiOperation({
    summary: 'Despublicar actividad',
  })
  unpublish(
    @Param('id', ParseUUIDPipe)
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.assignmentsService.unpublish(id, user.sub);
  }

  // =========================
  // DELETE
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Borrar actividad'
  })
  deleteAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.assignmentsService.deleteAssignment(id, user.sub);
  }
}