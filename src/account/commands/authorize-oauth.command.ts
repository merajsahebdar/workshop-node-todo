import { ICommand } from '@nestjs/cqrs';
import { AuthorizeOauthInput } from '../inputs';

/**
 * Authorize Oauth Command
 */
export class AuthorizeOauthCommand implements ICommand {
  /**
   * Constructor
   *
   * @param input
   */
  constructor(public readonly input: AuthorizeOauthInput) {}
}
