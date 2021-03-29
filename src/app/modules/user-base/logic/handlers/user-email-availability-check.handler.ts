import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEmailAvailabilityCheckCommand } from '../commands/user-email-availability-check.command';
import { UserService } from '../services/user.service';

/**
 * User Email Availability Check Command Handler
 */
@CommandHandler(UserEmailAvailabilityCheckCommand)
export class UserEmailAvailabilityCheckCommandHandler
  implements ICommandHandler<UserEmailAvailabilityCheckCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {UserEmailAvailabilityCheckCommand} command
   * @returns
   */
  async execute(command: UserEmailAvailabilityCheckCommand): Promise<boolean> {
    return !this.userService.exists(command.input);
  }
}
