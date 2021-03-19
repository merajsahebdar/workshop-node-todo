import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IAppRequest } from 'src/interfaces/app-request.interface';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { BaseGuard } from './base.guard';

/**
 * JWT Guard
 */
export class JwtGuard extends BaseGuard(JwtStrategy) {}

/**
 * GraphQL JWT Strategy
 */
export class GraphQLJwtGuard extends JwtGuard {
  /**
   * Get Request
   *
   * @param {ExecutaionContext} context
   * @returns
   */
  getRequest(context: ExecutionContext): IAppRequest {
    return GqlExecutionContext.create(context).getContext().req as IAppRequest;
  }
}
