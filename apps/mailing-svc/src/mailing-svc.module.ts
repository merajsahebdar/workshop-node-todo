import { natsConfig, redisConfig } from '@app/common';
import { MailingLibModule } from '@app/mailing-lib';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './configs';

/**
 * Mailing Service Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [mailerConfig, redisConfig, natsConfig],
      isGlobal: true,
    }),
    // Queue
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('queue.host'),
          port: configService.get('queue.port'),
        },
      }),
    }),
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
    // App Modules
    MailingLibModule,
  ],
})
export class MailingSvcModule {}
