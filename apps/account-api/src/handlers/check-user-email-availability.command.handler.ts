import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckUserEmailAvailabilityCommand } from '../commands';
import { UserService } from '../services';

/**
 * Check User Email Availability Command Handler
 */
@CommandHandler(CheckUserEmailAvailabilityCommand)
export class CheckUserEmailAvailabilityCommandHandler
  implements ICommandHandler<CheckUserEmailAvailabilityCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {CheckUserEmailAvailabilityCommand} command
   * @returns
   */
  async execute(command: CheckUserEmailAvailabilityCommand): Promise<boolean> {
    return !this.userService.exists(command.input);
  }
}
