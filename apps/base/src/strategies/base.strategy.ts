import { Nullable, IAppRequest } from '@app/shared';
import { Type, mixin } from '@nestjs/common';
import memoize from 'lodash.memoize';
import { IAuthJwtPayload } from '../interfaces';

/**
 * Strategy Interface
 */
export interface IStrategy {
  authenticate(
    request: IAppRequest,
  ): Nullable<IAuthJwtPayload> | Promise<Nullable<IAuthJwtPayload>>;
}

/**
 * Base Strategy
 *
 * @returns {Type<Strategy>}
 */
export const BaseStrategy: () => Type<IStrategy> = memoize(createBaseStrategy);

/**
 * Create Base Strategy
 *
 * @returns {Type<IStrategy>}
 */
function createBaseStrategy(): Type<IStrategy> {
  class MixinBaseStrategy {}

  return mixin(MixinBaseStrategy);
}
