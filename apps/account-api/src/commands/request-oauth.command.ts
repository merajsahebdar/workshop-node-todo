import { ICommand } from '@nestjs/cqrs';
import { IRequestOAuthInput } from '../interfaces';

/**
 * Request OAuth Command
 */
export class RequestOAuthCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IRequestOAuthInput} input
   */
  constructor(public readonly input: IRequestOAuthInput) {}
}
