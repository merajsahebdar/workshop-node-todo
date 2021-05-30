import { ICommand } from '@nestjs/cqrs';
import { Email, Profile, User } from '@prisma/client';

/**
 * Send Email Verification Message Command
 */
export class SendEmailVerificationMessageCommand implements ICommand {
  /**
   * Constructor
   *
   * @param user
   * @param email
   * @param profile
   */
  constructor(
    public readonly user: User,
    public readonly email: Email,
    public readonly profile: Profile,
  ) {}
}
