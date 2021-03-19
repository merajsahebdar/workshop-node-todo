import { Injectable, Inject } from '@nestjs/common';
import { AppInputError } from 'src/errors/app-input.error';
import { IAppRequest } from 'src/interfaces/app-request.interface';
import { Nullable } from 'src/types';
import { IAuthJwtPayload } from '../../interfaces/auth-jwt-payload';
import { JwtService } from '../services/jwt.service';
import { BaseStrategy, IStrategy } from './base.strategy';

/**
 * Jwt Strategy
 *
 * @memberof Feature/Auth/Strategy
 */
@Injectable()
export class JwtStrategy extends BaseStrategy() implements IStrategy {
  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * Authenticate
   *
   * @param {IAppRequest} request
   * @returns
   */
  async authenticate(request: IAppRequest): Promise<Nullable<IAuthJwtPayload>> {
    try {
      const token = this.getToken(request);
      return this.jwtService.verifyToken(token);
    } catch {
      return null;
    }
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
