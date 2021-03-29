import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from '../../../../utils';
import { UserEntity } from '../../database';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';

/**
 * Authorized User
 *
 * NOTO:
 * This decorator must be used in authorized requests.
 */
export const AuthorizedUser = createParamDecorator(
  (field: keyof UserEntity | undefined, context: ExecutionContext) => {
    const request = getRequest(context);

    const authorizedUser = (request as any)[
      REQUEST_AUTHORIZE_PROPERTY_KEY
    ] as UserEntity;

    return field ? authorizedUser[field] : authorizedUser;
  },
);
