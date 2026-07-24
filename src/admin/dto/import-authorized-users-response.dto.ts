import { ImportAuthorizedUserErrorDto } from "./import-authorized-user-error.dto";
import { ImportDuplicateUserDto } from "./import-duplicates-user.dto";
import { ImportDuplicatesDto } from "./import-duplicates.dto";

export class ImportAuthorizedUsersResponseDto {
  success!: boolean;

  imported!: number;

  duplicates!: ImportDuplicatesDto;
  
  errors!: ImportAuthorizedUserErrorDto[];

  totalRows!: number;
}