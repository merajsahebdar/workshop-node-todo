import { ICommand } from '@nestjs/cqrs';
import { SignUpInput } from '../inputs';

/**
 * Sign Up Command
 */
export class SignUpCommand implements ICommand {
  /**
   * Constructor
   *
   * @param input
   */
  constructor(public readonly input: SignUpInput) {}
}
