import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignAccessTokenCommand } from '../commands';
import { AuthService } from '../services';

/**
 * Sign Access Token Command Handler
 */
@CommandHandler(SignAccessTokenCommand)
export class SignAccessTokenCommandHandler
  implements ICommandHandler<SignAccessTokenCommand> {
  /**
   * Constructor
   *
   * @param {AuthService} authService
   */
  constructor(private authService: AuthService) {}

  /**
   * Execute
   *
   * @param {SignAccessTokenCommand} command
   * @returns
   */
  async execute({ user }: SignAccessTokenCommand): Promise<string> {
    return this.authService.signAccessToken(user);
  }
}
