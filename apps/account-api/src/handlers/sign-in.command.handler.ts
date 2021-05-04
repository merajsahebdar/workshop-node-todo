import { AppInputError, DatabaseService, HashService } from '@app/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { SignInCommand } from '../commands';
import { UserSignedInEvent } from '../events';
import { AuthService } from '../services';

/**
 * Sign In Command Handler
 */
@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  /**
   * Constructor
   *
   * @param eventBus
   * @param db
   * @param hash
   * @param authService
   */
  constructor(
    private eventBus: EventBus,
    private db: DatabaseService,
    private hash: HashService,
    private auth: AuthService,
  ) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute({ input }: SignInCommand): Promise<[User, string]> {
    const user = await this.db.user.findFirst({
      where: {
        emails: { some: { address: input.email.address } },
      },
    });
    if (user && user.password) {
      if (!(await this.hash.bcrypt(input.password, user.password))) {
        throw new AppInputError('The provided password is not correct.');
      }
      if (user.isBlocked) {
        throw new AppInputError('You have been blocked.');
      }

      const accessToken = this.auth.signAccessToken(user);

      this.eventBus.publish(new UserSignedInEvent(user));

      return [user, accessToken];
    }

    throw new AppInputError(
      `No user found with email address: '${input.email.address}'.`,
    );
  }
}
