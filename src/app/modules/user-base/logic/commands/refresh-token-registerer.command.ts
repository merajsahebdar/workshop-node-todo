import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '../../database/entities/user.entity';

/**
 * Refresh Token Registerer Command
 */
export class RefreshTokenRegistererCommand implements ICommand {
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
