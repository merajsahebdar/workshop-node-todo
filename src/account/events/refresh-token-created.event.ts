import { IEvent } from '@nestjs/cqrs';
import { RefreshToken, User } from '@prisma/client';

/**
 * Refresh Toke Created Event
 */
export class RefreshTokenCreatedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param user
   * @param refreshToken
   */
  constructor(
    public readonly user: User,
    public readonly refreshToken: RefreshToken,
  ) {}
}
