import { IEvent } from '@nestjs/cqrs';
import { RefreshTokenEntity, UserEntity } from '../entities';

/**
 * Refresh Toke Created Event
 */
export class RefreshTokenCreatedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   * @param {RefreshTokenEntity} refreshToken
   */
  constructor(
    public readonly user: UserEntity,
    public readonly refreshToken: RefreshTokenEntity,
  ) {}
}
