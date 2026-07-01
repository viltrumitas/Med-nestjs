import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,

} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { UserRole } from '@prisma/client';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('pending')
  findPending(@CurrentUser() user: JwtPayload) {
    return this.submissionsService.findPendingForTeacher(user.sub);
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TEACHER)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.submissionsService.findOne(
      id,
      user.sub,
      user.role,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto, @CurrentUser() user: JwtPayload) {
    return this.submissionsService.update(id, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Patch(':id/submit')
  submit(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.submissionsService.submit(id, user.sub);
  }
}
