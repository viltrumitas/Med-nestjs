import { CaseResponseDto } from '../dto/case-response.dto';
import { AuthorResponseDto } from '../dto/author-response.dto';
import { CaseStatus, UserRole } from '@prisma/client';

interface CaseAuthorEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface CaseEntity {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  author: CaseAuthorEntity;
}

export class CaseMapper {
  static toResponse(caseEntity: CaseEntity): CaseResponseDto {
    const author: AuthorResponseDto = {
      id: caseEntity.author.id,
      email: caseEntity.author.email,
      firstName: caseEntity.author.firstName,
      lastName: caseEntity.author.lastName,
      role: caseEntity.author.role,
    };

    return {
      id: caseEntity.id,
      title: caseEntity.title,
      description: caseEntity.description,
      status: caseEntity.status,
      author,
    };
  }
}
