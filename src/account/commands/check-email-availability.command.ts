import { ICommand } from '@nestjs/cqrs';
import { CheckEmailAvailabilityInput } from '../inputs';

/**
 * Check Email Availability Command
 */
export class CheckEmailAvailabilityCommand implements ICommand {
  /**
   * Constructor
   *
   * @param input
   */
  constructor(public readonly input: CheckEmailAvailabilityInput) {}
}
