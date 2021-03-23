import { ICommand } from '@nestjs/cqrs';
import { IUserEmailAvailabilityCheckInput } from '../../typing/interfaces/user-email-availability-check.input';

/**
 * User Email Availability Check Command
 */
export class UserEmailAvailabilityCheckCommand implements ICommand {
  /**
   * Constructor
   *
   * @param {IUserEmailAvailabilityCheckInput} input
   */
  constructor(public readonly input: IUserEmailAvailabilityCheckInput) {}
}
