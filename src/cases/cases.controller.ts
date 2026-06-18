import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
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
  @Roles(UserRole.TEACHER)
  @Post()
  @ApiOperation({
    summary: 'Crear nuevo caso clínico',
    description:
      'Solo docentes pueden crear casos clinicos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Caso clínico creado exitosamente',
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso (debes ser docente)',
  })
  create(@Body() dto: CreateCaseDto, @CurrentUser() user: JwtPayload) {
    return this.casesService.create(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los casos',
    description: 'Cualquiera que este loggeado puede ver los casos publicados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los casos',
  })
  findAll() {
    return this.casesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Get('my')
  @ApiOperation({
    summary: 'Obtener mis casos',
    description:
      '     Retorna todos los casos creados por el docente',
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id/publish')
  publish(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casesService.publish(id, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Patch(':id/unpublish')
  unpublish(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casesService.unpublish(id, user.sub)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @Delete('id')
  deleteCase(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casesService.deleteCase(id, user.sub)
  }
}
