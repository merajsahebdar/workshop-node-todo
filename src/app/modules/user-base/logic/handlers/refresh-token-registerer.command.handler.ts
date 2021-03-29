import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenRegistererCommand } from '../commands/refresh-token-registerer.command';
import { UserService } from '../services/user.service';

/**
 * Refresh Token Registerer Command Handler
 */
@CommandHandler(RefreshTokenRegistererCommand)
export class RefreshTokenRegistererCommandHandler
  implements ICommandHandler<RefreshTokenRegistererCommand> {
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {RefreshTokenRegistererCommand} command
   * @returns
   */
  async execute(command: RefreshTokenRegistererCommand) {
    // ...
    return this.userService.signRefreshToken(
      command.user,
      command.clientIp,
      command.userAgent,
    );
  }
}
