import { ReviewResponseDto } from '../dto/review-response.dto';
import { TeacherResponseDto } from '../dto/teacher-response.dto';
import { ReviewEntity } from '../entities/review.entity';

export class ReviewMapper {
  static toResponse(reviewEntity: ReviewEntity): ReviewResponseDto {
    const teacher: TeacherResponseDto = {
      id: reviewEntity.teacher.id,
      email: reviewEntity.teacher.email,
      firstName: reviewEntity.teacher.firstName,
      lastName: reviewEntity.teacher.lastName,
      role: reviewEntity.teacher.role,
    };

    return {
      id: reviewEntity.id,
      teacherId: reviewEntity.teacher.id,
      feedback: reviewEntity.feedback,
      teacher,
    };
  }
}
