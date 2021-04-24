import { Repository } from 'typeorm';
import { OAuthTicketEntity } from '../entities';

/**
 * OAuth Tickets Repository
 */
export type OAuthTicketsRepository = Repository<OAuthTicketEntity>;
