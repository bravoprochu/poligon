import { UserClaimsEnums } from '../enums/user-claims-enums';

export interface IUserTokenClaim {
  type: UserClaimsEnums;
  value: string;
}
