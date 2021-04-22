import { ICommand } from '@nestjs/cqrs';
import { AccountEntity, EmailEntity, UserEntity } from '../entities';

/**
 * Send Email Verification Message Command
 */
export class SendEmailVerificationMessageCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   * @param {EmailEntity} email
   * @param {AccountEntity} account
   */
  constructor(
    public readonly user: UserEntity,
    public readonly email: EmailEntity,
    public readonly account: AccountEntity,
  ) {}
}
