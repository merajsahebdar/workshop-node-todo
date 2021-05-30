import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MAILER_QUEUE } from '../constants';

/**
 * Mailer Queue Processor
 */
@Processor(MAILER_QUEUE)
export class MailerQueueProcessor {
  /**
   * Logger
   */
  private logger: Logger;

  /**
   * Constructor
   *
   * @param {MailerService} mailerService
   */
  constructor(private mailerService: MailerService) {
    this.logger = new Logger(MailerQueueProcessor.name);
  }

  /**
   * Send Mail
   *
   * @param {Job} job
   */
  @Process()
  async sendMail({ data }: Job) {
    try {
      await this.mailerService.sendMail(data);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  /**
   * On Failed
   *
   * @param {Error} error
   */
  @OnQueueEvent('failed')
  onFailed(error: Error) {
    this.logger.error(error.message);
  }
}
