import { INodeType } from './node.type';

/**
 * Refresh Token Type Interface
 */
export interface IRefreshTokenType extends INodeType {
  userId: string;
  userAgent: string;
  clientIp: string;
}
