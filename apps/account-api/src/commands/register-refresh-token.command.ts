import { ICommand } from '@nestjs/cqrs';
import { User } from '@prisma/client';

/**
 * Register Refresh Token Command
 */
export class RegisterRefreshTokenCommand implements ICommand {
  /**
   * Constructor
   *
   * @param user
   * @param clientIp
   * @param userAgent
   */
  constructor(
    public readonly user: User,
    public readonly clientIp: string = 'unknown',
    public readonly userAgent: string = 'unknown',
  ) {}
}
