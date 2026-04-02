import { SetMetadata } from '@nestjs/common';
import { Roles } from 'common/roles.enums';

export const RolesDecorators = (...roles: Roles[]) => SetMetadata('roles', roles);
