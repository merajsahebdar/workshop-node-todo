import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAILING_CLIENT } from './constants';
import { MailingService } from './services';

/**
 * Mailing Client Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Clients
    ClientsModule.registerAsync([
      {
        name: MAILING_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            url: configService.get('nats.url'),
          },
        }),
      },
    ]),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingClientModule {}
