import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DatabaseService } from '../../common';
import { RegisterRefreshTokenCommand } from '../commands';
import { RefreshTokenCreatedEvent } from '../events';
import { AuthService } from '../services';

/**
 * Register Refresh Token Command Handler
 */
@CommandHandler(RegisterRefreshTokenCommand)
export class RegisterRefreshTokenCommandHandler
  implements ICommandHandler<RegisterRefreshTokenCommand> {
  /**
   * Constructor
   *
   * @param eventBus
   * @param db
   * @param auth
   */
  constructor(
    private eventBus: EventBus,
    private db: DatabaseService,
    private auth: AuthService,
  ) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute({
    user,
    clientIp,
    userAgent,
  }: RegisterRefreshTokenCommand): Promise<string> {
    const refreshToken = await this.db.refreshToken.create({
      data: {
        clientIp,
        userAgent,
        userId: user.id,
      },
    });

    this.eventBus.publish(new RefreshTokenCreatedEvent(user, refreshToken));

    return this.auth.signRefreshToken(refreshToken);
  }
}
