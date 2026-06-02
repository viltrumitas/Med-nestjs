import { AuthorResponseDto } from './author-response.dto';

export class CaseResponseDto {
  id!: string;
  title!: string;
  description!: string;
  status!: string;

  author!: AuthorResponseDto;
}
