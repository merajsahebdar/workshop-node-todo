import { DatabaseService, SignedParamsService } from '@app/common';
import { AppInputError } from '@app/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../commands';
import { EmailVerifiedEvent } from '../events';

/**
 * Verify Email Command Handler
 */
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements ICommandHandler<VerifyEmailCommand> {
  /**
   * Constructor
   *
   * @param eventBus
   * @param db
   * @param signedParamsService
   */
  constructor(
    private eventBus: EventBus,
    private db: DatabaseService,
    private signedParamsService: SignedParamsService,
  ) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute(command: VerifyEmailCommand): Promise<boolean> {
    const { expires, signature, ...params } = command.input;

    if (!this.signedParamsService.verify(expires, signature, params)) {
      throw new AppInputError('The signature is invalid, or has been expired.');
    }

    const email = await this.db.email.update({
      where: {
        id: params.id,
      },
      data: {
        isVerified: true,
      },
    });

    this.eventBus.publish(new EmailVerifiedEvent(email));

    return true;
  }
}
