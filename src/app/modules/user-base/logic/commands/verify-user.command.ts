import { ICommand } from '@nestjs/cqrs';
import { IVerifyUserInput } from '../../typing/interfaces/verify-user.input';

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
