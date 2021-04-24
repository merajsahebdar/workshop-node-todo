import { SignedParamsService } from '@app/common';
import { AppInputError } from '@app/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '../commands';
import { EmailVerifiedEvent } from '../events';
import { EmailService } from '../services';

/**
 * Verify Email Command Handler
 */
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements ICommandHandler<VerifyEmailCommand> {
  /**
   * Constructor
   *
   * @param {EventBus} eventBus
   * @param {EmailService} emailService
   * @param {SignedParamsService} signedParamsService
   */
  constructor(
    private eventBus: EventBus,
    private emailService: EmailService,
    private signedParamsService: SignedParamsService,
  ) {}

  /**
   * Execute
   *
   * @param {VerifyEmailCommand} command
   */
  async execute(command: VerifyEmailCommand): Promise<boolean> {
    const { expires, signature, ...params } = command.input;

    const email = await this.emailService.findById(params.id);
    if (email.isVerified) {
      throw new AppInputError('The user email has been verified.');
    }

    if (!this.signedParamsService.verify(expires, signature, params)) {
      throw new AppInputError('The signature is invalid, or has been expired.');
    }

    await this.emailService.toggleVerification(email);

    this.eventBus.publish(new EmailVerifiedEvent(email));

    return true;
  }
}
