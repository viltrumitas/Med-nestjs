import { Module } from '@nestjs/common';
import { ClassroomsController } from './classroom.controller'; 
import { ClassroomsService } from './classroom.service';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
})
export class ClassroomsModule {}