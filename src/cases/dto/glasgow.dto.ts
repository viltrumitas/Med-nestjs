import { IsNumber, IsObject, IsOptional, Min, Max } from "class-validator";

export class GlasgowDto {
  @IsNumber()
  @Min(1)
  @Max(4)
  ocular!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  verbal!: number;

  @IsNumber()
  @Min(1)
  @Max(6)
  motora!: number;
}