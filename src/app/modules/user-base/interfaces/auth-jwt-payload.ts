import { IUserType } from './user.type';

/**
 * Auth Jwt Payload
 */
export interface IAuthJwtPayload {
  uid: string;
  sub: IUserType;
}
