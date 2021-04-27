import { IHttpRequest, JwtService, getRequest } from '@app/common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, ObjectLiteral, Repository } from 'typeorm';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';
import { IAuthStrategy } from '../interfaces';

/**
 * Jwt Auth Strategy
 */
@Injectable()
export class JwtAuthStrategy implements IAuthStrategy {
  /**
   * Users
   */
  private users: Repository<ObjectLiteral>;

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

    const token = this.getToken(request);

    if (token) {
      const { uid } = this.jwtService.verifyToken(token);

      const user = await this.users.findOne(uid);
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
   * @param {IHttpRequest} request
   * @throws {AppInputError} in case of missing a valid authorization header.
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
