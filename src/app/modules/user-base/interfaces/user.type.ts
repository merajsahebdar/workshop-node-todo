import { INodeType } from './node.type';

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
 * Unsafe User Type Interface
 */
export interface IUnsafeUserType extends IUserType {
  password: string;
}
