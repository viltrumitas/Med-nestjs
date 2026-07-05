import { User } from "@prisma/client";
import { StudentResponseDto } from "../dto/student-response.dto";

export class StudentMapper {
  static toResponse(user: User): StudentResponseDto {
    return {
      id: user.id,
      matricula: user.matricula,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}