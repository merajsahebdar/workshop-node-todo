import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegisterRefreshTokenCommand } from '../commands';
import { RefreshTokenCreatedEvent } from '../events';
import { AuthService, UserService } from '../services';

/**
 * Register Refresh Token Command Handler
 */
@CommandHandler(RegisterRefreshTokenCommand)
export class RegisterRefreshTokenCommandHandler
  implements ICommandHandler<RegisterRefreshTokenCommand> {
  /**
   * Constructor
   *
   * @param {EventBus} eventBus
   * @param {UserService} userService
   */
  constructor(
    private eventBus: EventBus,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /**
   * Execute
   *
   * @param {RegisterRefreshTokenCommand} command
   * @returns
   */
  async execute(command: RegisterRefreshTokenCommand) {
    const refreshToken = await this.userService.createRefreshToken({
      user: command.user,
      clientIp: command.clientIp,
      userAgent: command.userAgent,
    });

    this.eventBus.publish(
      new RefreshTokenCreatedEvent(command.user, refreshToken),
    );

    return this.authService.signRefreshToken(refreshToken);
  }
}
