import { Nullable, IAppRequest, JwtService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, ObjectLiteral, Repository } from 'typeorm';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REQUEST_AUTHORIZE_PROPERTY_KEY,
} from '../contants';
import { IStrategy } from '../interfaces';

/**
 * Refresh Token Auth Strategy
 *
 * @memberof Feature/Auth/Strategy
 */
@Injectable()
export class RefreshTokenAuthStrategy implements IStrategy {
  /**
   * Users
   */
  private users: Repository<ObjectLiteral>;

  /**
   * Refresh Tokens
   */
  private refreshTokens: Repository<ObjectLiteral>;

  /**
   * Constructor
   *
   * @param {Connection} connection
   * @param {JwtService} jwtService
   */
  constructor(
    @InjectConnection() private connection: Connection,
    private jwtService: JwtService,
  ) {
    this.refreshTokens = this.connection.getRepository('refresh_tokens');
    this.users = this.connection.getRepository('users');
  }

  /**
   * Authenticate
   *
   * @param {IAppRequest} request
   * @returns
   */
  async authenticate(req: IAppRequest): Promise<Nullable<any>> {
    try {
      const { uid, ver } = this.jwtService.verifyToken(
        req.cookies[REFRESH_TOKEN_COOKIE_KEY],
      );

      if ((await this.refreshTokens.count({ id: ver })) <= 0) {
        const user = await this.users.findOne(uid);
        req[REQUEST_AUTHORIZE_PROPERTY_KEY] = user;

        return true;
      }
    } catch {
      return null;
    }

    return null;
  }

  /**
   * Authorize the request using the given auth value.
   *
   * @param {IAppRequest} request
   * @param {IAuthJwtPayload} payload
   * @returns
   */
  async authorize(request: IAppRequest, { sub }: any): Promise<void> {
    (request as any)[REQUEST_AUTHORIZE_PROPERTY_KEY] = sub;
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
