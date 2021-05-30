import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DatabaseService } from '../../common';
import { CheckEmailAvailabilityCommand } from '../commands';

/**
 * Check Email Availability Command Handler
 */
@CommandHandler(CheckEmailAvailabilityCommand)
export class CheckEmailAvailabilityCommandHandler
  implements ICommandHandler<CheckEmailAvailabilityCommand> {
  /**
   * Constructor
   *
   * @param db
   */
  constructor(private db: DatabaseService) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute({ input }: CheckEmailAvailabilityCommand): Promise<boolean> {
    return (
      (await this.db.email.count({ where: { address: input.address } })) == 0
    );
  }
}
