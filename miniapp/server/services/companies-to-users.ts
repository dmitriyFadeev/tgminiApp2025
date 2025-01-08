import type { EUserRole } from '../enums/user/role';
import type { TUser } from '../models/advertising-company.model';
import type { TCompanyToUser } from '../models/companies-to-users.model';

export function companiesToUsers(
  companyUser: TCompanyToUser,
  email: string
): TUser {
  return {
    user: companyUser.userId.toString(),
    role: companyUser.role as EUserRole,
    email,
  };
}
