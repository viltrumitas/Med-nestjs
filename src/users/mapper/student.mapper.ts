import { User } from "@prisma/client";
import { StudentResponseDto } from "../dto/student-response.dto";
import { TeacherSummaryResponse } from "../dto/teacher-summary.dto";
import { StudentSummaryResponse } from "../dto/student-summary.dto";

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

  static toSummaryTeacher(user: User): TeacherSummaryResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  }

  static toSummaryStudent(user: User): StudentSummaryResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  }
}