import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { UserRole } from '@prisma/client';

@ApiTags('Cases')
@ApiBearerAuth('access_token')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post()
  @ApiOperation({
    summary: 'Crear nuevo caso clínico',
    description:
      'Solo estudiantes pueden crear casos. El estado inicial es DRAFT',
  })
  @ApiResponse({
    status: 201,
    description: 'Caso clínico creado exitosamente',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (debes ser estudiante)',
  })
  create(@Body() dto: CreateCaseDto, @CurrentUser() user: JwtPayload) {
    return this.casesService.create({
      ...dto,
      authorId: user.sub,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Patch(':id/submit')
  @ApiOperation({
    summary: 'Enviar caso para evaluación',
    description:
      'Cambia el estado del caso a SUBMITTED. Solo el autor puede enviar su caso',
  })
  @ApiResponse({
    status: 200,
    description: 'Caso enviado exitosamente',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (debes ser el autor)',
  })
  @ApiNotFoundResponse({
    description: 'Caso no encontrado',
  })
  @ApiConflictResponse({
    description: 'El caso ya ha sido enviado',
  })
  submit(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casesService.submit(id, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los casos',
    description: 'Solo admin y profesores pueden ver todos los casos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los casos',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso',
  })
  findAll() {
    return this.casesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('submitted')
  @ApiOperation({
    summary: 'Obtener casos enviados',
    description:
      'Solo profesores pueden ver casos que han sido enviados para evaluar',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de casos enviados',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (debes ser profesor)',
  })
  findSubmittedCases() {
    return this.casesService.findSubmittedCases();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('my')
  @ApiOperation({
    summary: 'Obtener mis casos',
    description:
      '     Retorna todos los casos creados por el estudiante autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mis casos',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso',
  })
  findMyCases(@CurrentUser() user: JwtPayload) {
    return this.casesService.findMyCases(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener caso por ID',
    description: 'Obtiene los detalles de un caso específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del caso',
  })
  @ApiNotFoundResponse({
    description: 'Caso no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }
}
