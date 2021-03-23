import { IEvent } from '@nestjs/cqrs';
import { UserEntity } from '../../database/entities/user.entity';

/**
 * User Signed Up Event
 */
export class UserSignedUpEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   */
  constructor(public readonly user: UserEntity) {}
}
