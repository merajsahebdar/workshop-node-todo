import { IEvent } from '@nestjs/cqrs';
import { EmailEntity } from '../entities';

/**
 * Email Verified Event
 */
export class EmailVerifiedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {EmailEntity} email
   */
  constructor(public readonly email: EmailEntity) {}
}
