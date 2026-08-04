import { MedicalAreaResponseDto } from '../dto/medical-area-response.dto';
import { MedicalAreaSummaryDto } from '../dto/medical-area-summary-response.dto'; 
import { MedicalAreaEntity } from '../entities/medical-area.entity';

export class MedicalAreaMapper {
  static toSummary(
    area: MedicalAreaEntity,
  ): MedicalAreaSummaryDto {
    return {
      id: area.id,
      name: area.name,
    };
  }

  static toResponse(
    area: MedicalAreaEntity,
  ): MedicalAreaResponseDto {
    return {
      id: area.id,
      name: area.name,
      description: area.description,
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,

      casesCount: area._count.cases,

      canDelete: area._count.cases === 0,
    };
  }
}