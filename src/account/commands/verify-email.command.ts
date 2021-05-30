import { ICommand } from '@nestjs/cqrs';
import { VerifyEmailInput } from '../inputs';

/**
 * Verify Email Command
 */
export class VerifyEmailCommand implements ICommand {
  /**
   * Constructor
   *
   * @param input
   */
  constructor(public readonly input: VerifyEmailInput) {}
}
