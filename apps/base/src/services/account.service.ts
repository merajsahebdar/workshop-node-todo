import { AppInputError } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { AccountEntity } from '../entities';
import { AccountsRepository } from '../repositories';

/**
 * Account Service
 */
@Injectable()
export class AccountService {
  /**
   * Constructor
   *
   * @param {AccountsRepository} accounts
   */
  constructor(
    @InjectRepository(AccountEntity) private accounts: AccountsRepository,
  ) {}

  /**
   * Create Account
   *
   * @param {DeepPartial<AccountEntity>} input
   * @returns
   */
  async createAccount(
    input: DeepPartial<AccountEntity>,
  ): Promise<AccountEntity> {
    return this.accounts.save(this.accounts.create(input));
  }

  /**
   * Find the account belongs to a specific user.
   *
   * @param {string} userId
   * @throws {AppInputError} in case of non-existing account.
   * @returns
   */
  async findByUserId(userId: string): Promise<AccountEntity> {
    const user = await this.accounts.findOne({ where: { userId } });

    if (user) {
      return user;
    }

    throw new AppInputError(
      `No account found belongs to the user with id: '${userId}'`,
    );
  }
}