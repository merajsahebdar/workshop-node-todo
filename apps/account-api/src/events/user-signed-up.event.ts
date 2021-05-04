import { Email, Profile, User } from '@prisma/client';
import { IEvent } from '@nestjs/cqrs';

/**
 * User Signed Up Event
 */
export class UserSignedUpEvent implements IEvent {
  /**
   * Constructor
   *
   * @param user
   * @param email
   * @param profile
   */
  constructor(
    public readonly user: User,
    public readonly email: Email,
    public readonly profile: Profile,
  ) {}
}
