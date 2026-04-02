// update-role.dto.ts
import { IsEnum } from 'class-validator';
import { Roles } from 'common/roles.enums';

export class UpdateRoleDto {
  @IsEnum(Roles)
  role: Roles;
}
