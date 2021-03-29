import { ICommand } from '@nestjs/cqrs';
import { IVerifyUserInput } from '../../typing';

/**
 * Verify User Command
 */
export class VerifyUserCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IVerifyUserInput} input
   */
  constructor(public readonly input: IVerifyUserInput) {}
}
