import { ApolloErrorFilter } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import { AccountApiModule } from './account-api.module';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(AccountApiModule);

  // Config Service
  const configService = app.get(ConfigService);

  // Global Filters
  app.useGlobalFilters(new ApolloErrorFilter());

  // Request Extending Tools
  app.use(cookieParser());
  app.use(requestIp.mw());

  // NOTE:
  // We need to register the container for `class-validator` to be able to
  //  use services and providers in class validation.
  useContainer(app.select(AccountApiModule), { fallbackOnErrors: true });

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
