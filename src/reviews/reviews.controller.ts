import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../common/types/jwt-payload.type';

@ApiTags('Reviews')
@ApiBearerAuth('access_token')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post('submission/:submissionId')
  @ApiOperation({
    summary: 'Crear evaluación de entrega',
  })
  create(
    @Param('submissionId', ParseUUIDPipe)
    submissionId: string,

    @Body()
    dto: CreateReviewDto,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.reviewsService.create(
      submissionId,
      user.sub,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('my')
  @ApiOperation({
    summary: 'Listar mis evaluaciones del maestro'
  })
  findMyReviews(
    @CurrentUser() user: JwtPayload
  ) {
    return this.reviewsService.findAllStudents(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('submission/:submissionId')
  @ApiOperation({
    summary: 'Obtener evaluación por submission',
  })
  findBySubmissionId(
    @Param('submissionId', ParseUUIDPipe)
    submissionId: string,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.reviewsService.findBySubmissionId(
      submissionId,
      user.sub,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.TEACHER)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener evaluación por ID',
  })
  findById(
    @Param('id', ParseUUIDPipe)
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.reviewsService.findById(
      id,
      user.sub,
      user.role,
    );
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get()
  @ApiOperation({
    summary: 'Listar evaluaciones',
  })
  findAll(
    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.reviewsService.findAll(
      user.sub,
    );
  }

  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar evaluación',
  })
  update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body()
    dto: UpdateReviewDto,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.reviewsService.update(
      id,
      user.sub,
      dto,
    );
  }
}