import { IsBoolean } from "class-validator";

export class PublishCaseDto {
  @IsBoolean()
  isPublished!: boolean;
}