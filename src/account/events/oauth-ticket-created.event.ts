import { IEvent } from '@nestjs/cqrs';
import { OauthTicket, User } from '@prisma/client';

/**
 * OAuth Ticket Created Event
 */
export class OAuthTicketCreatedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param oauthTicket
   * @param user
   */
  constructor(
    public readonly oauthTicket: OauthTicket,
    public readonly user: User,
  ) {}
}
