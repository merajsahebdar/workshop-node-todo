import { INodeEntity, INodeType } from '@app/common';
import { IUserEntity } from './user.interface';

/**
 * Email Type Interface
 */
export interface IEmailType extends INodeType {
  address: string;
  isPrimary: boolean;
  isVerified: boolean;
}

/**
 * Email Entity Interface
 */
export interface IEmailEntity extends INodeEntity, IEmailType {
  user: IUserEntity;
}
