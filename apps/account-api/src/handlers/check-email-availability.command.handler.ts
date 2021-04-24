import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckEmailAvailabilityCommand } from '../commands';
import { EmailService } from '../services';

/**
 * Check Email Availability Command Handler
 */
@CommandHandler(CheckEmailAvailabilityCommand)
export class CheckEmailAvailabilityCommandHandler
  implements ICommandHandler<CheckEmailAvailabilityCommand> {
  /**
   * Constructor
   *
   * @param {AuthService} authService
   */
  constructor(private emailService: EmailService) {}

  /**
   * Execute
   *
   * @param {CheckEmailAvailabilityCommand} command
   * @returns
   */
  async execute({ input }: CheckEmailAvailabilityCommand): Promise<boolean> {
    return !(await this.emailService.isRegistered(input.email));
  }
}
