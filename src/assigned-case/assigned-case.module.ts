import { Module } from '@nestjs/common';
import { AssignedCaseController } from './assigned-case.controller';
import { AssignedCaseService } from './assigned-case.service';

@Module({
  controllers: [AssignedCaseController],
  providers: [AssignedCaseService]
})
export class AssignedCaseModule {}
