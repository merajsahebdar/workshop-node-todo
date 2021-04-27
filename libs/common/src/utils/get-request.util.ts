import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { IHttpRequest } from '../interfaces';

/**
 * Return request from context.
 *
 * @param {ExecutionContext} context
 */
export function getRequest(context: ExecutionContext): IHttpRequest {
  switch (context.getType<GqlContextType>()) {
    case 'graphql':
      return GqlExecutionContext.create(context).getContext().req;
    default:
      return context.switchToHttp().getRequest<IHttpRequest>();
  }
}
