import { IsString, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  caseId!: string;

  @IsString()
  feedback!: string;
}
