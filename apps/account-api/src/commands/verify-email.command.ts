import { ICommand } from '@nestjs/cqrs';
import { IVerifyEmailInput } from '../interfaces';

/**
 * Verify Email Command
 */
export class VerifyEmailCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IVerifyEmailInput} input
   */
  constructor(public readonly input: IVerifyEmailInput) {}
}
