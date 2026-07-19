import { AuthorizedUserEntity } from "../entities/admin.entity";

import { AuthorizedUserResponseDto } from "../dto/authorized-user-response.dto";
import { AuthorizedUserSummaryDto } from "../dto/authorized-user-summary.dto";

export class AdminMapper {
  static toResponse(
    user: AuthorizedUserEntity,
  ): AuthorizedUserResponseDto {
    return {
      id: user.id,
      matricula: user.matricula,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toSummary(
    user: AuthorizedUserEntity,
  ): AuthorizedUserSummaryDto {
    return {
      id: user.id,
      matricula: user.matricula,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  }
}