import { Module } from '@nestjs/common';
import { MAILING_QUEUE_MODULES } from '../../constants';
import { MailingService } from './services';

/**
 * Mailing Client Module
 */
@Module({
  imports: [...MAILING_QUEUE_MODULES],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingClientModule {}
