import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueEvent, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MAILING_QUEUE } from '../constants';

/**
 * Mailing Queue Processor
 */
@Processor(MAILING_QUEUE)
export class MailingQueueProcessor {
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
    this.logger = new Logger(MailingQueueProcessor.name);
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
