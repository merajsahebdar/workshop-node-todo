import { IEvent } from '@nestjs/cqrs';
import { User } from '@prisma/client';

/**
 * User Signed In Event
 */
export class UserSignedInEvent implements IEvent {
  /**
   * Constructor
   *
   * @param user
   */
  constructor(public readonly user: User) {}
}
