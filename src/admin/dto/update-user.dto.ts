import { PartialType } from "@nestjs/swagger";
import { CreateAuthorizedUserDto } from "./create-user.dto";

export class UpdateAuthorizedUserDto extends PartialType(CreateAuthorizedUserDto) {}