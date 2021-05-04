import { ICommand } from '@nestjs/cqrs';
import { SignInInput } from '../inputs';

/**
 * Sign In Command
 */
export class SignInCommand implements ICommand {
  /**
   * Constructor
   *
   * @param input
   */
  constructor(public readonly input: SignInInput) {}
}
