import { ICommand } from '@nestjs/cqrs';
import { RequestOauthInput } from '../inputs';

/**
 * Request Oauth Command
 */
export class RequestOauthCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IRequestOAuthInput} input
   */
  constructor(public readonly input: RequestOauthInput) {}
}
