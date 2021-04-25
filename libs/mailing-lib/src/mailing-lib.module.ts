import { Module } from '@nestjs/common';
import { MailingQueueProcessor } from './queue-processors';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MAILING_QUEUE_MODULES } from './constants';

/**
 * Mailing Lib Module
 */
@Module({
  imports: [
    ...MAILING_QUEUE_MODULES,
    // Third-party Modules
    // Mailer
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get('mailer.transport'),
        defaults: {
          from: configService.get('mailer.defaults.from'),
        },
      }),
    }),
  ],
  providers: [MailingQueueProcessor],
})
export class MailingLibModule {}
