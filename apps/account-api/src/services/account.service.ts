import { AppInputError } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { AccountEntity, UserEntity } from '../entities';
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
    const account = await this.accounts
      .createQueryBuilder('Account')
      .leftJoin(UserEntity, 'User', 'User.id = Account.user')
      .where('User.id = :userId', { userId })
      .getOne();

    if (account) {
      return account;
    }

    throw new AppInputError(
      `No account found belongs to the user with id: '${userId}'`,
    );
  }
}
