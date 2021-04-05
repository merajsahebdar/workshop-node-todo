import { IEvent } from '@nestjs/cqrs';
import { AccountEntity, UserEntity } from '../../database';

/**
 * Account Created Event
 */
export class AccountCreatedEvent implements IEvent {
  /**
   * Constructo
   *
   * @param {AccountEntity} account
   * @param {UserEntity} user
   */
  constructor(
    public readonly account: AccountEntity,
    public readonly user: UserEntity,
  ) {}
}
