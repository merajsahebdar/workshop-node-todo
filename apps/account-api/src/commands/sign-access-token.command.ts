import { ICommand } from '@nestjs/cqrs';
import { User } from '@prisma/client';

/**
 * Sign Access Token Command
 */
export class SignAccessTokenCommand implements ICommand {
  /**
   * Constructor
   *
   * @param user
   */
  constructor(public readonly user: User) {}
}
