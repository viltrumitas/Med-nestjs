import {
  IsObject,
  IsOptional,
} from 'class-validator';
import { GlasgowDto } from './glasgow.dto';

export class NeurologicalDto {
  @IsOptional()
  @IsObject()
  cincinnati?: Record<string, any>;

  @IsOptional()
  glasgow?: GlasgowDto;
}