import { IsString } from "class-validator";

export class GeneralInfoDto {
  @IsString()
  title?: string;

  @IsString()
  consult!: string;

  @IsString()
  scenery!: string;
}