import {
  IHttpRequest,
  JwtService,
  getRequest,
  DatabaseService,
} from '@app/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';
import { IAuthStrategy } from '../interfaces';

/**
 * Jwt Auth Strategy
 */
@Injectable()
export class JwtAuthStrategy implements IAuthStrategy {
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

    const token = this.getToken(request);

    if (token) {
      const { uid } = this.jwt.verifyToken(token);

      const user = await this.db.user.findUnique({ where: { id: uid } });
      if (user) {
        request[REQUEST_AUTHORIZE_PROPERTY_KEY] = user;

        return true;
      }
    }

    return false;
  }

  /**
   * Get authorization token from request headers.
   *
   * @param request
   * @returns
   */
  private getToken(request: IHttpRequest): string | null {
    const authorization = request.headers['authorization'];

    if (authorization) {
      const matches = authorization.match(/(\S+)\s+(\S+)/);
      if (matches?.[2]) {
        return matches[2];
      }
    }

    return null;
  }
}
