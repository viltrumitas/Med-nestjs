import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { validationSchema } from './config/validation.schema';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CasesModule } from './cases/cases.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AssignedCaseService } from './assigned-case/assigned-case.service';
import { AssignedCaseController } from './assigned-case/assigned-case.controller';
import { AssignedCaseModule } from './assigned-case/assigned-case.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CasesModule,
    ReviewsModule,
    SubmissionsModule,
    AssignmentsModule,
    AssignedCaseModule,
  ],
  providers: [AssignedCaseService],
  controllers: [AssignedCaseController],
})
export class AppModule {}
