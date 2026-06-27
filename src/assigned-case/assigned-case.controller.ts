import { Controller, UseGuards, Get, Param, Post } from '@nestjs/common';

import { AssignedCaseService } from './assigned-case.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
@Controller('assigned-case')
export class AssignedCaseController {
  constructor(private readonly assignedCaseService: AssignedCaseService) {}

  @Get('my')
  findMyAssignedCases(@CurrentUser() user: JwtPayload) {
    return this.assignedCaseService.findMyAssignedCases(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.assignedCaseService.findOne(id, user.sub);
  }

  @Post(':id/start-submission')
  startSubmission(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.assignedCaseService.startSubmission(id, user.sub)
  }
}
