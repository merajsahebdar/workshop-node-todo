import { IUserEmailAvailabilityCheckInput } from '../../interfaces/user-email-availability-check.input';

/**
 * User Email Availability Check Command
 */
export class UserEmailAvailabilityCheckCommand {
  /**
   * Constructor
   *
   * @param {IUserEmailAvailabilityCheckInput} input
   */
  constructor(public readonly input: IUserEmailAvailabilityCheckInput) {}
}
