import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import { UserRole } from '@prisma/client';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post()
  create(@Body() dto: CreateCaseDto, @CurrentUser() user: JwtPayload) {
    return this.casesService.create({
      ...dto,
      authorId: user.sub,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Patch(':id/submit')
  submit(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casesService.submit(id, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get()
  findAll() {
    return this.casesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }
}
