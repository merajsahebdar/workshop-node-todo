import { INodeEntity, INodeType } from '@app/common';
import { IUserEntity } from './user.interface';

/**
 * Refresh Token Type Interface
 */
export interface IRefreshTokenType extends INodeType {
  userAgent: string;
  clientIp: string;
}

/**
 * Refresh Token Entity Interface
 */
export interface IRefreshTokenEntity extends INodeEntity, IRefreshTokenType {
  user: IUserEntity;
}
