import { IAppRequest } from '@app/shared';
import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Auth Guard Interface
 */
export type IAuthGuard = CanActivate & {
  /**
   * Get the request instance from the context.
   *
   * @param {ExecutionContext} context
   * @returns
   */
  getRequest(context: ExecutionContext): IAppRequest;
};
