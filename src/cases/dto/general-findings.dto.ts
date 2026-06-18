import { IsOptional, IsString } from "class-validator";

export class GeneralFindingsDto {
  @IsOptional()
  @IsString()
  generalFindings?: string;
} 