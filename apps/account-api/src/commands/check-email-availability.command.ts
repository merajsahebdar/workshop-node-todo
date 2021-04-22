import { ICommand } from '@nestjs/cqrs';
import { ICheckEmailAvailabilityInput } from '../interfaces';

/**
 * Check Email Availability Command
 */
export class CheckEmailAvailabilityCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {ICheckEmailAvailabilityInput} input
   */
  constructor(public readonly input: ICheckEmailAvailabilityInput) {}
}
