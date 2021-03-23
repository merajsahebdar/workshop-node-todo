import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bull';
import { join } from 'path';
import { stringify } from 'qs';
import { IMailerQueueJobData } from '../queue-processors/mailer.queue-processor';
import { SendUserVerificationEmailCommand } from '../commands/send-user-verification-email.command';
import { SignedParamsService } from '../services/signed-params.service';

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
    @InjectQueue('mailer') private mailerQueue: Queue<IMailerQueueJobData>,
    private configService: ConfigService,
    private signedParamsService: SignedParamsService,
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
      this.configService.get('app.userVerificationURL'),
    );

    await this.mailerQueue.add({
      options: {
        to: user.email,
        template: join(
          __dirname,
          '..',
          '..',
          'resource',
          'templates',
          'verification',
        ),
        context: {
          user,
          verificationURL: verificationURL.toString(),
        },
      },
    });
  }
}
