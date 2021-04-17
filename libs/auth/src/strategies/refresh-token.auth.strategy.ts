import { JwtService, getRequest } from '@app/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, ObjectLiteral, Repository } from 'typeorm';
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
   * @param {ExecutionContext} context
   * @returns
   */
  async authenticate(context: ExecutionContext): Promise<boolean> {
    const request = getRequest(context);

    if (!!request[REQUEST_AUTHORIZE_PROPERTY_KEY]) {
      return true;
    }

    const { uid, ver } = this.jwtService.verifyToken(
      request.cookies[REFRESH_TOKEN_COOKIE_KEY],
    );

    const refreshToken = this.refreshTokens.findOne(ver);
    const user = this.users.findOne(uid);
    if (refreshToken && user) {
      request[REQUEST_AUTHORIZE_PROPERTY_KEY] = user;

      return true;
    }

    return false;
  }
}
