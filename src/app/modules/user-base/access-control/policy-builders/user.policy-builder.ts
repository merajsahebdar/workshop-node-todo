import { getRequest } from '../../../../utils/get-request.util';
import { UserEntity } from '../../database/entities/user.entity';
import { REQUEST_AUTHORIZE_PROPERTY_KEY } from '../../logic/guards/base.guard';
import {
  IPolicyBuilder,
  IPolicyBuilderOptions,
} from '../../typing/interfaces/policy-builder.interface';
import { IPolicyBuilderSubject } from '../../typing/interfaces/subject.interface';
import { UserPolicyAction } from '../actions/user-policy.action';

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
