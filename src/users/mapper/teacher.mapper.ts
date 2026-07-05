import { User } from "@prisma/client";
import { TeacherResponseDto } from "../dto/teacher-response.dto";

export class TeacherMapper {
  static toResponse(user: User): TeacherResponseDto {
    return {
      id: user.id,
      matricula: user.matricula,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}