import { ApolloErrorFilter } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import { BaseModule } from './base.module';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(BaseModule);

  // Config Service
  const configService = app.get(ConfigService);

  // Global Filters
  app.useGlobalFilters(new ApolloErrorFilter());

  // Request Extending Tools
  app.use(cookieParser());
  app.use(requestIp.mw());

  // NOTO:
  // We need to register the container for `class-validator` to be able to
  //  use services and providers in class validation.
  useContainer(app.select(BaseModule), { fallbackOnErrors: true });

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
