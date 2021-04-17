import { getRequest, IAppRequest } from '@app/common';
import { ExecutionContext, Inject, Type, mixin } from '@nestjs/common';
import memoize from 'lodash.memoize';
import { IAuthStrategy, IAuthGuard } from '../interfaces';

/**
 * Auth Guard
 *
 * @returns
 */
export const AuthGuard: (StrategyClass: {
  new (...args: any[]): IAuthStrategy;
}) => Type<IAuthGuard> = memoize(createAuthGuard);

/**
 * Create Auth Guard
 *
 * @returns
 */
function createAuthGuard(StrategyClass: {
  new (...args: any[]): IAuthStrategy;
}): Type<IAuthGuard> {
  class MixinBaseGuard implements IAuthGuard {
    /**
     * Strategy
     */
    @Inject(StrategyClass)
    private strategy: IAuthStrategy;

    /**
     * Can Activate
     *
     * @param {ExecutionContext} context
     * @returns
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      return this.strategy.authenticate(context);
    }

    /**
     * Get the request instance from the context.
     *
     * @param {ExecutionContext} context
     * @returns
     */
    getRequest(context: ExecutionContext): IAppRequest {
      return getRequest(context);
    }
  }

  return mixin(MixinBaseGuard);
}
