import { Controller, UseGuards, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

import { CreateAuthorizedUserDto } from './dto/create-user.dto';
import { UpdateAuthorizedUserDto } from './dto/update-user.dto';

@ApiTags('Admin')
@ApiBearerAuth('access_token')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Post('authorized-users')
  @ApiOperation({ summary: 'Agregar un usuario' })
  create(
    @Body() dto: CreateAuthorizedUserDto,
  ) {
    return this.adminService.create(dto)
  }

  @Get('authorized-users')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  findAll() {
    return this.adminService.findAll()
  }

  @Get('authorized-users/:id')
  @ApiOperation({ summary: 'Buscar un usuario por id' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.findOne(id);
  }

  @Patch('authorized-users/:id')
  @ApiOperation({ summary: 'Modificar un usuario' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAuthorizedUserDto,
  ) {
    return this.adminService.update(id, dto);
  }

  @Delete('authorized-users/:id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.delete(id);
  }
}
