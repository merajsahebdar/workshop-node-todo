import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { OAuthTicketEntity, UserEntity } from '../entities';
import { OAuthTicketsRepository } from '../repositories';

/**
 * OAuth Ticket Service
 */
export class OAuthTicketService {
  /**
   * OAuth Tickets Repository
   */
  @InjectRepository(OAuthTicketEntity)
  oauthTickets: OAuthTicketsRepository;

  /**
   * Update OAuth Ticket by User
   *
   * @param {UserEntity} user
   * @param {DeepPartial<OAuthTicketEntity>} oauthTicketEntityLike
   * @returns
   */
  async updateOAuthTicketByUser(
    user: UserEntity,
    oauthTicketEntityLike: Omit<DeepPartial<OAuthTicketEntity>, 'user'>,
  ): Promise<OAuthTicketEntity> {
    const oauthTicket =
      (await this.oauthTickets
        .createQueryBuilder('OAuthTicket')
        .leftJoin(UserEntity, 'User', 'OAuthTicket.user = User.id')
        .where('OAuthTicket.provider = :provider', {
          provider: oauthTicketEntityLike.provider,
        })
        .andWhere('User.id = :userId', { userId: user.id })
        .getOne()) || this.oauthTickets.create({ user });

    return this.oauthTickets.save(
      this.oauthTickets.merge(oauthTicket, oauthTicketEntityLike),
    );
  }
}
