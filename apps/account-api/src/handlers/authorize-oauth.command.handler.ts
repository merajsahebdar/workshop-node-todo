import { OauthService } from '@app/auth';
import { DatabaseService } from '@app/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { AuthorizeOauthCommand } from '../commands';
import { OAuthTicketCreatedEvent, UserSignedUpEvent } from '../events';
import { AuthService } from '../services';

/**
 * Authorize Oauth Command Handler
 */
@CommandHandler(AuthorizeOauthCommand)
export class AuthorizeOauthCommandHandler
  implements ICommandHandler<AuthorizeOauthCommand> {
  /**
   * Constructor
   *
   * @param eventBus
   * @param oauth
   * @param auth
   */
  constructor(
    private eventBus: EventBus,
    private db: DatabaseService,
    private oauth: OauthService,
    private auth: AuthService,
  ) {}

  /**
   * Execute
   *
   * @param command
   * @returns
   */
  async execute({ input }: AuthorizeOauthCommand): Promise<[User, string]> {
    const [
      { email: oauthEmail, profile: oauthProfile },
      encryptedTicketData,
    ] = await this.oauth.authorizeOauth(input.adapterName, input.code);

    const user = await this.db.user.findFirst({
      where: {
        emails: {
          some: {
            address: oauthEmail.address,
          },
        },
      },
    });

    if (user) {
      const oauthTicket = await this.db.oauthTicket.findFirst({
        where: { adapterName: input.adapterName, userId: user.id },
      });

      if (oauthTicket) {
        await this.db.oauthTicket.update({
          where: {
            id: oauthTicket.id,
          },
          data: {
            encryptedTicketData,
          },
        });
      } else {
        await this.db.oauthTicket.create({
          data: {
            adapterName: input.adapterName,
            encryptedTicketData,
            userId: user.id,
          },
        });
      }

      return [user, this.auth.signAccessToken(user)];
    } else {
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
          ...oauthProfile,
          user: {
            create: {
              isActivated: true,
              isBlocked: false,
              emails: {
                create: {
                  ...oauthEmail,
                  isPrimary: true,
                  isVerified: true,
                },
              },
            },
          },
        },
      });

      const oauthTicket = await this.db.oauthTicket.create({
        data: {
          adapterName: input.adapterName,
          encryptedTicketData,
          userId: user.id,
        },
      });

      this.eventBus.publish(new UserSignedUpEvent(user, email, profile));
      this.eventBus.publish(new OAuthTicketCreatedEvent(oauthTicket, user));

      return [user, this.auth.signAccessToken(user)];
    }
  }
}
