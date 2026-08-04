import { Controller, Get, Delete, Post, Patch, Param, Body, UseGuards, } from "@nestjs/common";
import { Roles } from "src/common/decorators/roles.decorator";

import { MedicalAreasService } from "./medical-areas.service";

import { CreateMedicalAreaDto } from "./dto/create-medical-area.dto";
import { UpdateMedicalAreaDto } from "./dto/update-medical-area.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('medical-areas')
export class MedicalAreasController {
  constructor(
    private readonly medicalAreaService: MedicalAreasService,
  ) { }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() dto: CreateMedicalAreaDto,
  ) {
    return this.medicalAreaService.create(dto);
  }


  @Get()
  findAll() {
    return this.medicalAreaService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.medicalAreaService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalAreaDto,
  ) {
    return this.medicalAreaService.update(id, dto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.medicalAreaService.remove(id);
  }
}