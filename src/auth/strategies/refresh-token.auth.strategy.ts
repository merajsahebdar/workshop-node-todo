import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, getRequest, DatabaseService } from '../../common';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REQUEST_AUTHORIZE_PROPERTY_KEY,
} from '../contants';
import { IAuthStrategy } from '../interfaces';

/**
 * Refresh Token Auth Strategy
 *
 * @memberof Feature/Auth/Strategy
 */
@Injectable()
export class RefreshTokenAuthStrategy implements IAuthStrategy {
  /**
   * Constructor
   *
   * @param db
   * @param jwt
   */
  constructor(private db: DatabaseService, private jwt: JwtService) {}

  /**
   * Authenticate
   *
   * @param context
   * @returns
   */
  async authenticate(context: ExecutionContext): Promise<boolean> {
    const request = getRequest(context);

    if (!!request[REQUEST_AUTHORIZE_PROPERTY_KEY]) {
      return true;
    }

    const { uid, ver } = this.jwt.verifyToken(
      request.cookies[REFRESH_TOKEN_COOKIE_KEY],
    );

    const refreshToken = this.db.refreshToken.findUnique({
      where: { id: ver },
    });
    const user = this.db.user.findUnique({ where: { id: uid } });
    if (refreshToken && user) {
      request[REQUEST_AUTHORIZE_PROPERTY_KEY] = user;

      return true;
    }

    return false;
  }
}
