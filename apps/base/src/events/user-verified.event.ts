import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '../entities';

/**
 * User Verified Event
 */
export class UserVerifiedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   */
  constructor(public readonly user: UserEntity) {}
}
