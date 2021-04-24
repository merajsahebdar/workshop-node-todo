import { AppInputError } from '@app/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../entities';
import { SignInCommand } from '../commands';
import { UserSignedInEvent } from '../events';
import { UserService } from '../services';

/**
 * Sign In Command Handler
 */
@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  /**
   * Constructor
   *
   * @param {EventBus} eventBus
   * @param {UserService} userService
   */
  constructor(private eventBus: EventBus, private userService: UserService) {}

  /**
   * Execute
   *
   * @param {SignInCommand} command
   * @returns
   */
  async execute({ input }: SignInCommand): Promise<[UserEntity, string]> {
    const user = await this.userService.findUserByEmailAddress(input.email);
    if (!(await user.comparePassword(input.password))) {
      throw new AppInputError('The provided password is not correct.');
    }
    if (user.isBlocked) {
      throw new AppInputError('You have been blocked.');
    }

    const accessToken = this.userService.signAccessToken(user);

    this.eventBus.publish(new UserSignedInEvent(user));

    return [user, accessToken];
  }
}
