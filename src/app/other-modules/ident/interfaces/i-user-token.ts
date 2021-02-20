import { UserClaimsEnums } from '../enums/user-claims-enums';
import { UserRolesEnums } from '../enums/user-roles-enums';
import { IUserTokenClaim } from './i-user-token-claim';

export interface IUserToken {
  claims: IUserTokenClaim[];
  expirationTime: Date | string;
  roles: UserRolesEnums[];
  token: string;
  userName: string;
}
