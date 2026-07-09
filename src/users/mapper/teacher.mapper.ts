import { User } from "@prisma/client";
import { TeacherResponseDto } from "../dto/teacher-response.dto";
import { TeacherSummaryResponse } from "../dto/teacher-summary.dto";

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

  static toSummaryTeacher(
    user: {
      id: string;
      firstName: string;
      lastName: string;
    }): TeacherSummaryResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }
}