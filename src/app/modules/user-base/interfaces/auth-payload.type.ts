import { IUserType } from './user.type';

/**
 * Auth Payload Type Interface
 */
export interface IAuthPayloadType {
  user: IUserType;
  token: string;
}
