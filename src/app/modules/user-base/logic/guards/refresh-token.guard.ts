import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { getRequest } from '../../../../utils';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REQUEST_AUTHORIZE_PROPERTY_KEY,
} from '../contants';
import { JwtService, UserService } from '../services';

/**
 * Refresh Token Guard
 */
export class RefreshTokenGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * Can Activate
   *
   * @param {ExecutionContext} context
   * @returns
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = getRequest(context);

    try {
      const { uid, ver } = this.jwtService.verifyToken(
        req.cookies[REFRESH_TOKEN_COOKIE_KEY],
      );

      if (await this.userService.refreshTokenExists({ id: ver })) {
        const user = await this.userService.findById(uid);
        req[REQUEST_AUTHORIZE_PROPERTY_KEY] = user;

        return true;
      }
    } catch {
      return false;
    }

    return false;
  }
}
