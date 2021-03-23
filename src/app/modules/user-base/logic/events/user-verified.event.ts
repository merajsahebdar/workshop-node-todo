import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '../../database/entities/user.entity';

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
