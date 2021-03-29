import { ICommand } from '@nestjs/cqrs';
import { ISignUpInput } from '../../typing';

/**
 * Sign Up Command
 */
export class SignUpCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {ISignUpInput} input
   */
  constructor(public readonly input: ISignUpInput) {}
}
