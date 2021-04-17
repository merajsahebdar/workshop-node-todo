import { ExecutionContext, Inject, Type, mixin } from '@nestjs/common';
import memoize from 'lodash.memoize';
import { IAcGuard, IAcStrategy } from '../interfaces';

/**
 * Access Control Guard
 *
 * @returns
 */
export const AcGuard: (StrategyClass: {
  new (...args: any[]): IAcStrategy;
}) => Type<IAcGuard> = memoize(createAcGuard);

/**
 * Create Access Control Guard
 *
 * @returns
 */
function createAcGuard(StrategyClass: {
  new (...args: any[]): IAcStrategy;
}): Type<IAcGuard> {
  class MixinAcGuard implements IAcGuard {
    /**
     * Strategy
     */
    @Inject(StrategyClass)
    private strategy: IAcStrategy;

    /**
     * Can Activate
     *
     * @param {ExecutionContext} context
     * @returns
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      return this.strategy.hasPermission(context);
    }
  }

  return mixin(MixinAcGuard);
}
