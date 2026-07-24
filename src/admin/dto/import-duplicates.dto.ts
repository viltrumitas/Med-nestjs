import { ImportDuplicateUserDto } from "./import-duplicates-user.dto";

export class ImportDuplicatesDto {
  count!: number;
  users!: ImportDuplicateUserDto[];
}