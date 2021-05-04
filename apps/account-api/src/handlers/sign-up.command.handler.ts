import { User } from '@prisma/client';
import { DatabaseService, HashService } from '@app/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../commands';
import { AccountCreatedEvent, UserSignedUpEvent } from '../events';
import { AuthService } from '../services';

/**
 * Sign Up Command Handler
 */
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  /**
   * Constructor
   *
   * @param eventBus
   * @param db
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
  async execute({ input }: SignUpCommand): Promise<[User, string]> {
    const {
      user: {
        emails: [email],
        ...user
      },
      ...profile
    } = await this.db.profile.create({
      include: {
        user: {
          include: {
            emails: true,
          },
        },
      },
      data: {
        ...input.profile,
        user: {
          create: {
            password: await this.hash.bcrypt(input.password),
            isActivated: true,
            isBlocked: false,
            emails: {
              create: {
                ...input.email,
                isPrimary: true,
                isVerified: false,
              },
            },
          },
        },
      },
    });

    const accessToken = this.auth.signAccessToken(user);

    this.eventBus.publish(new UserSignedUpEvent(user, email, profile));
    this.eventBus.publish(new AccountCreatedEvent(user, email, profile));

    return [user, accessToken];
  }
}
