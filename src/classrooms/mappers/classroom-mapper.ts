import { ClassroomListEntity, ClassroomDetailEntity } from "../entities/classroom.entity";
import { ClassroomResponseDto } from "../dto/classroom-response.dto";
import { Classroom } from "@prisma/client";
import { ClassroomSummaryResponseDto } from "src/classrooms/dto/assignment-summary-response.dto";
import { TeacherMapper } from "src/users/mapper/teacher.mapper";
import { StudentMapper } from "src/users/mapper/student.mapper";

export class ClassroomMapper {
  static toResponse(
    classroom: ClassroomListEntity,
  ): ClassroomResponseDto {

    const teacher = TeacherMapper.toResponse(classroom.teacher)

    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description,
      code: classroom.code,
      isActive: classroom.isActive,
      teacher,
      createdAt: classroom.createdAt,
      updatedAt: classroom.updatedAt,
    };
  }

  static toSummary(classroom: Classroom): ClassroomSummaryResponseDto {
    return {
      id: classroom.id,
      name: classroom.name,
      code: classroom.code,
    };
  }

  static toDetailResponse(classroom: ClassroomDetailEntity) {
    return {
      ...this.toResponse(classroom),

      assignments: classroom.assignments,

      students: classroom.enrollments.map((e) =>
        StudentMapper.toResponse(e.student)
      ),
    }
  }
}