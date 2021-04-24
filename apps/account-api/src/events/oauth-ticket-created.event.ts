import { IEvent } from '@nestjs/cqrs';
import { OAuthTicketEntity, UserEntity } from '../entities';

/**
 * OAuth Ticket Created Event
 */
export class OAuthTicketCreatedEvent implements IEvent {
  /**
   * Constructor
   *
   * @param {OAuthTicketEntity} oauthTicket
   * @param {UserEntity} user
   */
  constructor(
    public readonly oauthTicket: OAuthTicketEntity,
    public readonly user: UserEntity,
  ) {}
}
