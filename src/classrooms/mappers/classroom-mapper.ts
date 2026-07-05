import { Classroom } from "@prisma/client";

import {
  ClassroomListEntity,
  ClassroomDetailEntity,
} from "../entities/classroom.entity";

import { ClassroomResponseDto } from "../dto/classroom-response.dto";
import { ClassroomDetailResponseDto } from "../dto/classroom-detail-response.dto";
import { ClassroomSummaryResponseDto } from "../dto/assignment-summary-response.dto"; 

import { TeacherMapper } from "src/users/mapper/teacher.mapper";
import { StudentMapper } from "src/users/mapper/student.mapper";
import { AssignmentMapper } from "src/assignments/mapper/assignment.mapper";

export class ClassroomMapper {
  static toResponse(
    classroom: ClassroomListEntity,
  ): ClassroomResponseDto {
    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description,
      code: classroom.code,
      isActive: classroom.isActive,

      teacher: TeacherMapper.toResponse(classroom.teacher),

      studentsCount: classroom._count.enrollments,
      assignmentsCount: classroom._count.assignments,

      createdAt: classroom.createdAt,
      updatedAt: classroom.updatedAt,
    };
  }

  static toSummary(
    classroom: Classroom,
  ): ClassroomSummaryResponseDto {
    return {
      id: classroom.id,
      name: classroom.name,
      code: classroom.code,
    };
  }

  static toDetailResponse(
    classroom: ClassroomDetailEntity,
  ): ClassroomDetailResponseDto {
    return {
      ...this.toResponse(classroom),

      assignments: classroom.assignments.map((assignment) =>
        AssignmentMapper.toSummary(assignment),
      ),

      students: classroom.enrollments.map((enrollment) =>
        StudentMapper.toResponse(enrollment.student),
      ),
    };
  }
}