import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MailingSvcModule } from './mailing-svc.module';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailingSvcModule,
    {
      transport: Transport.NATS,
    },
  );

  // Run!
  await app.listenAsync();
})();
