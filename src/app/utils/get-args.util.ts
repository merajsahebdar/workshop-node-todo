import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { IAppRequest } from '../interfaces';

/**
 * Return args from context.
 *
 * @param {ExecutionContext} context
 */
export function getArgs(context: ExecutionContext): any {
  switch (context.getType<GqlContextType>()) {
    case 'graphql':
      return GqlExecutionContext.create(context).getArgs();
    default:
      return context.switchToHttp().getRequest<IAppRequest>().params;
  }
}
