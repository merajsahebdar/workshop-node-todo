import { IEvent } from '@nestjs/cqrs';
import { Profile, Email, User } from '@prisma/client';

/**
 * Account Created Event
 */
export class AccountCreatedEvent implements IEvent {
  /**
   * Constructo
   *
   * @param user
   * @param email
   * @param account
   */
  constructor(
    public readonly user: User,
    public readonly email: Email,
    public readonly profile: Profile,
  ) {}
}
