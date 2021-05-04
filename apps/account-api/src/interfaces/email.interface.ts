import { GraphNodeInterface } from '@app/common';

/**
 * Graph Email Interface
 */
export interface GraphEmailInterface extends GraphNodeInterface {
  address: string;
  isPrimary: boolean;
  isVerified: boolean;
}
