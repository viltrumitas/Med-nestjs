import { IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}
