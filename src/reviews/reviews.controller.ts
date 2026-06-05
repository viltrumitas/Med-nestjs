import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { UserRole } from '@prisma/client';

@ApiTags('Reviews')
@ApiBearerAuth('access_token')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Post()
  @ApiOperation({
    summary: 'Crear evaluación de caso',
    description:
      'Los profesores crean evaluaciones y retroalimentación para casos enviados',
  })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (debes ser profesor)',
  })
  @ApiNotFoundResponse({
    description: 'Caso no encontrado',
  })
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.create({
      ...dto,
      teacherId: user.sub,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('case/:caseId')
  @ApiOperation({
    summary: 'Obtener evaluaciones del caso',
    description:
      'Los estudiantes pueden ver las evaluaciones que los profesores han hecho de sus casos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones del caso',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para ver estas evaluaciones',
  })
  @ApiNotFoundResponse({
    description: 'Caso no encontrado',
  })
  findByCase(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reviewsService.findByCase(caseId, user.sub);
  }
}
