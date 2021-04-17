import { getRequest } from '@app/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';

/**
 * Authorized User
 *
 * NOTO:
 * This decorator must be used in authorized requests.
 */
export const AuthorizedUser = createParamDecorator(
  (field: string | undefined, context: ExecutionContext) => {
    const request = getRequest(context);

    const authorizedUser = (request as any)[REQUEST_AUTHORIZE_PROPERTY_KEY];

    return field ? authorizedUser[field] : authorizedUser;
  },
);
