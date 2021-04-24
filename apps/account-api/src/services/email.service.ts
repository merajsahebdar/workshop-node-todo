import { AppInputError } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { EmailEntity, UserEntity } from '../entities';
import { EmailsRepository } from '../repositories';

/**
 * Email Service
 */
@Injectable()
export class EmailService {
  /**
   * Emails Repository
   */
  @InjectRepository(EmailEntity)
  private emails: EmailsRepository;

  /**
   * Check whether is any email exists with given address or not.
   *
   * @param {string} address
   * @returns
   */
  async isRegistered(address: string): Promise<boolean> {
    return (await this.emails.count({ where: { address } })) > 0;
  }

  /**
   * Create Email
   *
   * @param {DeepPartial<EmailEntity>} entityLike
   * @returns
   */
  async createEmail(
    entityLike: DeepPartial<EmailEntity>,
  ): Promise<EmailEntity> {
    return this.emails.save(this.emails.create(entityLike));
  }

  /**
   * Toggle Verification
   *
   * @param {EmailEntity} email
   * @return
   */
  async toggleVerification(email: EmailEntity): Promise<EmailEntity> {
    email.isVerified = !email.isVerified;
    return await this.emails.save(email);
  }

  /**
   * Find a user email using the provided id.
   *
   * @param {string} id
   * @throws {AppInputError} in case of non-existing user for
   *  the provided id.
   * @returns
   */
  async findById(id: string): Promise<EmailEntity> {
    const email = await this.emails
      .createQueryBuilder('Email')
      .where('Email.id = :id', { id })
      .getOne();

    if (email) {
      return email;
    }

    throw new AppInputError(`No user email found with id: '${id}'`);
  }

  /**
   * Find emails using the provided user id.
   *
   * @param {string} userId
   * @returns
   */
  async findManyByUserId(userId: string): Promise<EmailEntity[]> {
    return this.emails
      .createQueryBuilder('Email')
      .leftJoin(UserEntity, 'User', 'User.id = Email.user')
      .where('User.id = :userId', { userId })
      .orderBy('Email.createdAt', 'DESC')
      .getMany();
  }
}
