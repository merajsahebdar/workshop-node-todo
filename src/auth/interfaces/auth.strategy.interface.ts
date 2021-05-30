import { ExecutionContext } from '@nestjs/common';

/**
 * Auth Strategy Interface
 */
export interface IAuthStrategy {
  /**
   * Authenticate
   *
   * @param {ExecutionContext} context
   * @returns
   */
  authenticate(context: ExecutionContext): boolean | Promise<boolean>;
}
