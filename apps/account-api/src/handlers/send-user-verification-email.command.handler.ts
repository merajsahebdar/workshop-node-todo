import { SignedParamsService } from '@app/common';
import { MailingService } from '@app/mailing-lib';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { join } from 'path';
import { stringify } from 'qs';
import { SendUserVerificationEmailCommand } from '../commands';

/**
 * Send User Verification Email Command Handler
 */
@CommandHandler(SendUserVerificationEmailCommand)
export class SendUserVerificationEmailCommandHandler
  implements ICommandHandler<SendUserVerificationEmailCommand> {
  /**
   * Constructor
   *
   * @param {Queue} mailerQueue
   * @param {ConfigService} configService
   * @param {SignedParamsService} signedParamsService
   */
  constructor(
    private configService: ConfigService,
    private signedParamsService: SignedParamsService,
    private mailingService: MailingService,
  ) {}

  /**
   * Execute
   *
   * @param {SendUserVerificationEmailCommand} command
   */
  async execute({ user }: SendUserVerificationEmailCommand): Promise<void> {
    const [expires, signature] = this.signedParamsService.sign({
      id: user.id,
      email: user.email,
    });

    const verificationURL = new URL(
      stringify(
        {
          expires,
          signature,
        },
        { addQueryPrefix: true },
      ),
      this.configService.get('app.setting.userVerificationURL'),
    );

    await this.mailingService.sendMail({
      to: user.email,
      template: join(__dirname, 'templates', 'verification.pug'),
      context: {
        user,
        verificationURL: verificationURL.toString(),
      },
    });
  }
}
