import { ICommand } from '@nestjs/cqrs';
import { ICheckUserEmailAvailabilityInput } from '../../typing';

/**
 * Check User Email Availability Command
 */
export class CheckUserEmailAvailabilityCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {ICheckUserEmailAvailabilityInput} input
   */
  constructor(public readonly input: ICheckUserEmailAvailabilityInput) {}
}