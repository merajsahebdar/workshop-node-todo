import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '../entities';

/**
 * Register Refresh Token Command
 */
export class RegisterRefreshTokenCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   */
  constructor(
    public readonly user: UserEntity,
    public readonly clientIp?: string,
    public readonly userAgent?: string,
  ) {}
}
