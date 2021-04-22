import { IEvent } from '@nestjs/cqrs';
import { AccountEntity, EmailEntity, UserEntity } from '../entities';

/**
 * User Signed Up Event
 */
export class UserSignedUpEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   * @param {EmailEntity} email
   * @param {AccountEntity} account
   */
  constructor(
    public readonly user: UserEntity,
    public readonly email: EmailEntity,
    public readonly account: AccountEntity,
  ) {}
}
