import { INodeEntity, INodeType } from '@app/common';
import { IEmailType } from './email.interface';

/**
 * User Type Interface
 */
export interface IUserType extends INodeType {
  emails: IEmailType[];
  isActivated: boolean;
  isBlocked: boolean;
}

/**
 * User Entity Interface
 */
export interface IUserEntity extends INodeEntity, IUserType {
  password?: string;
}
