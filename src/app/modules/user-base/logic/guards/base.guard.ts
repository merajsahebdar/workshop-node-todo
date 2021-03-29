import {
  CanActivate,
  ExecutionContext,
  Inject,
  Type,
  mixin,
} from '@nestjs/common';
import memoize from 'lodash.memoize';
import { IAppRequest } from '../../../../interfaces/app-request.interface';
import { getRequest } from '../../../../utils/get-request.util';
import { IAuthJwtPayload } from '../../typing/interfaces/auth-jwt-payload';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';
import { UserService } from '../services/user.service';
import { IStrategy } from '../strategies/base.strategy';

/**
 * Guard Interface
 */
export type IGuard = CanActivate & {
  /**
   * Get the request instance from the context.
   *
   * @param {ExecutionContext} context
   * @returns
   */
  getRequest(context: ExecutionContext): IAppRequest;

  /**
   * Authorize the request using the given jwt payload.
   *
   * @param {IAppRequest} request
   * @param {IAuthJwtPayload} payload
   * @returns
   */
  authorize(
    request: IAppRequest,
    payload: IAuthJwtPayload,
  ): void | Promise<void>;

  /**
   * Check whether the current request is authorized befor or not.
   *
   * @param {IAppRequest} request
   * @returns
   */
  isAuthorized(request: IAppRequest): boolean | Promise<boolean>;
};

/**
 * Base Guard
 *
 * @returns
 */
export const BaseGuard: (StrategyClass: {
  new (...args: any[]): IStrategy;
}) => Type<IGuard> = memoize(createBaseGuard);

/**
 * Create Base Guard
 *
 * @returns
 */
function createBaseGuard(StrategyClass: {
  new (...args: any[]): IStrategy;
}): Type<IGuard> {
  class MixinBaseGuard implements IGuard {
    @Inject(StrategyClass)
    private strategy: IStrategy;

    @Inject(UserService)
    private userService: UserService;

    /**
     * Can Activate
     *
     * @param {ExecutionContext} context
     * @returns
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = this.getRequest(context);

      const isAuthorized = await this.isAuthorized(request);
      if (isAuthorized) {
        return true;
      }

      const payload = await this.strategy.authenticate(request);
      if (payload) {
        await this.authorize(request, payload);
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

    /**
     * Authorize the request using the given auth value.
     *
     * @param {IAppRequest} request
     * @param {IAuthJwtPayload} payload
     * @returns
     */
    async authorize(
      request: IAppRequest,
      { uid }: IAuthJwtPayload,
    ): Promise<void> {
      const user = await this.userService.findById(uid);
      (request as any)[REQUEST_AUTHORIZE_PROPERTY_KEY] = user;
    }

    /**
     * Check whether the current request is authorized befor or not.
     *
     * @param {IAppRequest} request
     * @returns
     */
    isAuthorized(request: IAppRequest): boolean | Promise<boolean> {
      return !!(request as any)[REQUEST_AUTHORIZE_PROPERTY_KEY];
    }
  }

  return mixin(MixinBaseGuard);
}
