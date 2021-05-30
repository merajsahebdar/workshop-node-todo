import { ExecutionContext } from '@nestjs/common';

/**
 * Access Control Strategy Interface
 */
export interface IAcStrategy {
  /**
   * Check whether the authorized user has permissions to continue or not.
   *
   * @param {ExecutionContext} context
   * @returns
   */
  hasPermission(context: ExecutionContext): Promise<boolean> | boolean;
}
