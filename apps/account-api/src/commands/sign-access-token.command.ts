import { ICommand } from '@nestjs/cqrs';
import { UserEntity } from '../entities';

/**
 * Sign Access Token Command
 */
export class SignAccessTokenCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {UserEntity} user
   */
  constructor(public readonly user: UserEntity) {}
}
