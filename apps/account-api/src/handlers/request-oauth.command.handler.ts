import { OAuthService } from '@app/auth';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestOAuthCommand } from '../commands/request-oauth.command';

/**
 * Request OAuth Command Handler
 */
@CommandHandler(RequestOAuthCommand)
export class RequestOAuthCommandHandler
  implements ICommandHandler<RequestOAuthCommand> {
  /**
   * Constructor
   *
   * @param {OAuthService} oauthService
   */
  constructor(private oauthService: OAuthService) {}

  /**
   * Execute
   *
   * @param {RequestOAuthCommand} command
   * @returns
   */
  async execute(command: RequestOAuthCommand): Promise<string> {
    return this.oauthService.requestOAuth(command.input.provider);
  }
}
