import { IAppRequest, Nullable } from '@app/shared';

/**
 * Strategy Interface
 */
export interface IStrategy {
  authenticate(request: IAppRequest): Nullable<any> | Promise<Nullable<any>>;

  /**
   * Authorize the request using the given jwt payload.
   *
   * @param {IAppRequest} request
   * @param {IAuthJwtPayload} payload
   * @returns
   */
  authorize(request: IAppRequest, payload: any): void | Promise<void>;

  /**
   * Check whether the current request is authorized befor or not.
   *
   * @param {IAppRequest} request
   * @returns
   */
  isAuthorized(request: IAppRequest): boolean | Promise<boolean>;
}
