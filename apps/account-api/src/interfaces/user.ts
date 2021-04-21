import { INodeEntity, INodeType } from '@app/common';

/**
 * User Type Interface
 */
export interface IUserType extends INodeType {
  email: string;
  isActivated: boolean;
  isBlocked: boolean;
  isVerified: boolean;
}

/**
 * User Entity Interface
 */
export interface IUserEntity extends INodeEntity, IUserType {
  password: string;
}
