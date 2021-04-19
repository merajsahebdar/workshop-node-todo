import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import { GatewayApiModule } from './gateway-api.module';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(GatewayApiModule);

  // Config Service
  const configService = app.get(ConfigService);

  // Request Extending Tools
  app.use(cookieParser());
  app.use(requestIp.mw());

  const origin = configService.get('app.origin');
  if (origin) {
    app.enableCors({
      credentials: true,
      origin,
    });
  }

  // Run!
  await app.listen(configService.get('app.port', 3000));
})();
