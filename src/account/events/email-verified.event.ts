import { IEvent } from '@nestjs/cqrs';
import { Email } from '@prisma/client';

/**
 * Email Verified Event
 */
export class EmailVerifiedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param email
   */
  constructor(public readonly email: Email) {}
}
