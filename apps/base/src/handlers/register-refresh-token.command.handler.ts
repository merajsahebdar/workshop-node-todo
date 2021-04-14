import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterRefreshTokenCommand } from '../commands';
import { UserService } from '../services';

/**
 * Register Refresh Token Command Handler
 */
@CommandHandler(RegisterRefreshTokenCommand)
export class RegisterRefreshTokenCommandHandler
  implements ICommandHandler<RegisterRefreshTokenCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {RegisterRefreshTokenCommand} command
   * @returns
   */
  async execute(command: RegisterRefreshTokenCommand) {
    return this.userService.signRefreshToken(
      command.user,
      command.clientIp,
      command.userAgent,
    );
  }
}
