import {
  IPolicyBuilder,
  IPolicyBuilderOptions,
  IPolicyBuilderSubject,
} from '@app/auth';
import { getRequest } from '@app/shared';
import { UserEntity } from '../entities';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../contants';
import { UserPolicyAction } from '../actions';

// User Policy Builder Subject
type UserPolicyBuilderSubject = IPolicyBuilderSubject<UserEntity>;

/**
 * User Policy
 */
export class UserPolicyBuilder
  implements IPolicyBuilder<UserPolicyAction, UserPolicyBuilderSubject> {
  /**
   * Builder
   *
   * @inheritdoc
   */
  build({
    can,
    context,
  }: IPolicyBuilderOptions<UserPolicyAction, UserPolicyBuilderSubject>) {
    const { id: userId }: UserEntity = (getRequest(context) as any)[
      REQUEST_AUTHORIZE_PROPERTY_KEY
    ];

    // Generic User Permissions
    can(UserPolicyAction.VERIFY, ['typeorm', UserEntity, { id: userId }]);
    can(UserPolicyAction.READ, ['typeorm', UserEntity, { id: userId }]);
  }
}
