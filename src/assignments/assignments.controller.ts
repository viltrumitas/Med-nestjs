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
  constructor(private readonly assignmentsService: AssignmentsService) { }

  // =========================
  // CREATE
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post()
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
  findMyAssignments(@CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findMyAssignments(user.sub);
  }

  // =========================
  // MY PUBLISHED CASES (CASOS DISPONIBLES)
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my/published-cases')
  findMyPublishedCases(@CurrentUser() user: JwtPayload) {
    return this.assignmentsService.findMyPublishedCases(user.sub);
  }

  // =========================
  // GET BY ID
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assignmentsService.findOne(id);
  }

  // =========================
  // PUBLISH
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id/publish')
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.assignmentsService.publish(id, user.sub);
  }

  // =========================
  // DELETE
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Delete(':id')
  deleteAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.assignmentsService.deleteAssignment(id, user.sub);
  }
}