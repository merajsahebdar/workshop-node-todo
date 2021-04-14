import { ICommand } from '@nestjs/cqrs';
import { ISignInInput } from '../interfaces';

/**
 * Sign In Command
 */
export class SignInCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {ISignInInput} input
   */
  constructor(public readonly input: ISignInInput) {}
}