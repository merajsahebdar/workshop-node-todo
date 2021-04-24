import { ICommand } from '@nestjs/cqrs';
import { IAuthorizeOAuthInput } from '../interfaces';

/**
 * Authorize OAuth Command
 */
export class AuthorizeOAuthCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IAuthorizeOAuthInput} input
   */
  constructor(public readonly input: IAuthorizeOAuthInput) {}
}
