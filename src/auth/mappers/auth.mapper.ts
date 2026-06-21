import { UserResponseDto } from "../dto/user-response.dto";
import { UserEntity } from "../entities/auth.entity";

export class AuthMapper {
  static toUserResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      matricula: user.matricula,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}