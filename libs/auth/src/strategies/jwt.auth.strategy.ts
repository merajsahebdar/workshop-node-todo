import { Nullable, IAppRequest, AppInputError, JwtService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, ObjectLiteral, Repository } from 'typeorm';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';
import { IStrategy } from '../interfaces';

/**
 * Jwt Auth Strategy
 *
 * @memberof Feature/Auth/Strategy
 */
@Injectable()
export class JwtAuthStrategy implements IStrategy {
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
   * @param {IAppRequest} request
   * @returns
   */
  async authenticate(req: IAppRequest): Promise<Nullable<any>> {
    try {
      const token = this.getToken(req);
      return this.jwtService.verifyToken(token);
    } catch {
      return null;
    }
  }

  /**
   * Authorize the request using the given auth value.
   *
   * @param {IAppRequest} request
   * @param {IAuthJwtPayload} payload
   * @returns
   */
  async authorize(request: IAppRequest, { uid }: any): Promise<void> {
    (request as any)[REQUEST_AUTHORIZE_PROPERTY_KEY] = await this.users.findOne(
      uid,
    );
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

  /**
   * Get authorization token from request headers.
   *
   * @param {IAppRequest} request
   * @throws {AppInputError} in case of missing a valid authorization header.
   * @returns
   */
  private getToken(request: IAppRequest): string {
    const authorization = request.headers['authorization'];

    if (authorization) {
      const matches = authorization.match(/(\S+)\s+(\S+)/);
      if (matches?.[2]) {
        return matches[2];
      }
    }

    throw new AppInputError('No valid authorization header has been provided.');
  }
}
