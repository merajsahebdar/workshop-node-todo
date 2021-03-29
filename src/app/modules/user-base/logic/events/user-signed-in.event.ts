import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '../../database';

/**
 * User Signed In Event
 */
export class UserSignedInEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   */
  constructor(public readonly user: UserEntity) {}
}
