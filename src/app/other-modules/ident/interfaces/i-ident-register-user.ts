import { IIdentUser } from './i-ident-user';

export interface IIdentRegisterUser extends IIdentUser {
  rePassword: string;
}
