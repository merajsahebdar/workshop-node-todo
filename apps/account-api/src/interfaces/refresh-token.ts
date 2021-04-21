import { INodeEntity, INodeType } from '@app/common';

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
  userId: string;
}
