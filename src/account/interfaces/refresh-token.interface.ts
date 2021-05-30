import { GraphNodeInterface } from '../../common';

/**
 * Graph Refresh Token Interface
 */
export interface GraphRefreshTokenInterface extends GraphNodeInterface {
  userAgent: string;
  clientIp: string;
}
