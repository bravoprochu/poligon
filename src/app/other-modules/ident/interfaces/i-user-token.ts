import { UserClaimsEnums } from '../enums/user-claims-enums';
import { UserRolesEnums } from '../enums/user-roles-enums';

export interface IUserToken {
  claims: UserClaimsEnums[];
  expirationTime: Date | string;
  roles: UserRolesEnums[];
  token: string;
}
