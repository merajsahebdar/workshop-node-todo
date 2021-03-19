import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { IAppRequest } from 'src/interfaces/app-request.interface';

/**
 * Return request from context.
 *
 * @param {ExecutaionC} context
 */
export function getRequest(context: ExecutionContext): IAppRequest {
  switch (context.getType<GqlContextType>()) {
    case 'graphql':
      return GqlExecutionContext.create(context).getContext().req;
    default:
      return context.switchToHttp().getRequest<IAppRequest>();
  }
}
