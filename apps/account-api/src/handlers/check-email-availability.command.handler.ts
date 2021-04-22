import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckEmailAvailabilityCommand } from '../commands';
import { UserService } from '../services';

/**
 * Check Email Availability Command Handler
 */
@CommandHandler(CheckEmailAvailabilityCommand)
export class CheckEmailAvailabilityCommandHandler
  implements ICommandHandler<CheckEmailAvailabilityCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {CheckEmailAvailabilityCommand} command
   * @returns
   */
  async execute(command: CheckEmailAvailabilityCommand): Promise<boolean> {
    return !this.userService.emailExists({ address: command.input.email });
  }
}
