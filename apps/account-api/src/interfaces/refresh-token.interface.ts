import { GraphNodeInterface } from '@app/common';

/**
 * Graph Refresh Token Interface
 */
export interface GraphRefreshTokenInterface extends GraphNodeInterface {
  userAgent: string;
  clientIp: string;
}
