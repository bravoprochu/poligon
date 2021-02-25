import { IUserToken } from '../../ident/interfaces/i-user-token';

export type StorageAppSettingsType = IUserToken | null;
export type StorageAppSettingsKeys = 'userInfo';

export interface IStorageAppSettings {
  userInfo: IUserToken | null;
}
