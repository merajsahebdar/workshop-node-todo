import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AppInputError } from '../../../../errors/app-input.error';
import { VerifyUserCommand } from '../commands/verify-user.command';
import { UserVerifiedEvent } from '../events/user-verified.event';
import { SignedParamsService } from '../services/signed-params.service';
import { UserService } from '../services/user.service';

/**
 * Verify User Command Handler
 */
@CommandHandler(VerifyUserCommand)
export class VerifyUserCommandHandler
  implements ICommandHandler<VerifyUserCommand> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   * @param {SignedParamsService} signedParamsService
   */
  constructor(
    private eventBus: EventBus,
    private userService: UserService,
    private signedParamsService: SignedParamsService,
  ) {}

  /**
   * Execute
   *
   * @param {VerifyUserCommand} command
   */
  async execute(command: VerifyUserCommand): Promise<boolean> {
    const { expires, signature, ...params } = command.input;

    const user = await this.userService.findById(params.id);
    if (user.isVerified) {
      throw new AppInputError('The user has been verified.');
    }

    if (!this.signedParamsService.verify(expires, signature, params)) {
      throw new AppInputError('The signature is invalid, or has been expired.');
    }

    await this.userService.toggleVerification(user);

    this.eventBus.publish(new UserVerifiedEvent(user));

    return true;
  }
}
