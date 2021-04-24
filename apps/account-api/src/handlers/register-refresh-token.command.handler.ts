import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegisterRefreshTokenCommand } from '../commands';
import { RefreshTokenCreatedEvent } from '../events';
import { AuthService, RefreshTokenService } from '../services';

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
    private refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Execute
   *
   * @param {RegisterRefreshTokenCommand} command
   * @returns
   */
  async execute({
    user,
    clientIp,
    userAgent,
  }: RegisterRefreshTokenCommand): Promise<string> {
    const refreshToken = await this.refreshTokenService.createRefreshToken({
      user,
      clientIp,
      userAgent,
    });

    this.eventBus.publish(new RefreshTokenCreatedEvent(user, refreshToken));

    return this.authService.signRefreshToken(refreshToken);
  }
}
