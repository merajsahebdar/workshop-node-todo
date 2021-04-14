import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

// Job Interface
export interface IMailerQueueJobData {
  options: ISendMailOptions;
}

/**
 * Mailer Queue Processor
 */
@Processor('mailer')
export class MailerQueueProcessor {
  /**
   * Constructor
   *
   */
  constructor(private mailerService: MailerService) {}

  /**
   * Send Email
   */
  @Process()
  async sendEmail({ data }: Job<IMailerQueueJobData>) {
    await this.mailerService.sendMail(data.options);
  }

  @OnQueueFailed()
  failed(job, error) {
    console.log(error);
  }
}
