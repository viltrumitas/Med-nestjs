import { Body, Controller, Post, Get, Param, UseGuards, ParseUUIDPipe, Patch, Delete } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
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
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post()
  @ApiOperation({
    summary: 'Crear nueva actividad',
    description: 'Solo los docentes pueden crear actividades'
  })
  @ApiResponse({
    status: 201,
    description: 'Actividad creada exitosamente',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (debes ser docente'
  })
  create(@Body() dto: CreateAssignmentDto, @CurrentUser() user: JwtPayload) {
    return this.assignmentsService.create(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my')
  @ApiOperation({
    summary: 'Obtener mis actividades',
    description: 'Retorna todas las actividades creadas por el docente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de actividades',
  })
  findMyAssignments(@CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findMyAssignments(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my/published')
  findMyPublished(@CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findMyPublishedCases(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener actividad por ID',
    description: 'Obtiene los detalles de la actividad'
  })
  @ApiNotFoundResponse({
    description: 'Actividad no encontrada'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id/publish')
  @ApiOperation({
    summary: 'Publicar actividad',
    description: 'Publica la actividad y genera automaticamente las asignaciones para los alumnos.'
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad publicada exitosamente'
  })
  publish(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.assignmentsService.publish(id, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar actividad',
  })
  @ApiResponse({
    status: 200,
    description: 'Actividad eliminada'
  })
  deleteAssignment(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.assignmentsService.deleteAssignment(id, user.sub)
  }
}
