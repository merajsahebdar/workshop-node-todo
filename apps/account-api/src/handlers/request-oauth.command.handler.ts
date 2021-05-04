import { OauthService } from '@app/auth';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestOauthCommand } from '../commands';

/**
 * Request Oauth Command Handler
 */
@CommandHandler(RequestOauthCommand)
export class RequestOauthCommandHandler
  implements ICommandHandler<RequestOauthCommand> {
  /**
   * Constructor
   *
   * @param oauth
   */
  constructor(private oauth: OauthService) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute({ input }: RequestOauthCommand): Promise<string> {
    return this.oauth.requestOauth(input.adapterName);
  }
}
