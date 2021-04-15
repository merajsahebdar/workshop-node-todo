import { getRequest, IAppRequest } from '@app/shared';
import { ExecutionContext, Inject, Type, mixin } from '@nestjs/common';
import memoize from 'lodash.memoize';
import { IStrategy, IAuthGuard } from '../interfaces';

/**
 * Auth Guard
 *
 * @returns
 */
export const AuthGuard: (StrategyClass: {
  new (...args: any[]): IStrategy;
}) => Type<IAuthGuard> = memoize(createAuthGuard);

/**
 * Create Auth Guard
 *
 * @returns
 */
function createAuthGuard(StrategyClass: {
  new (...args: any[]): IStrategy;
}): Type<IAuthGuard> {
  class MixinBaseGuard implements IAuthGuard {
    @Inject(StrategyClass)
    private strategy: IStrategy;

    /**
     * Can Activate
     *
     * @param {ExecutionContext} context
     * @returns
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = this.getRequest(context);

      const isAuthorized = await this.strategy.isAuthorized(request);
      if (isAuthorized) {
        return true;
      }

      const payload = await this.strategy.authenticate(request);
      if (payload) {
        await this.strategy.authorize(request, payload);
        return true;
      }

      return false;
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
