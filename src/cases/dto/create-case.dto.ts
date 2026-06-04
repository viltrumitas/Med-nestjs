import { IsString, IsOptional } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description!: string;
}
