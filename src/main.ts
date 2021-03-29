import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import { AppModule } from './app';
import { ApolloErrorFilter } from './app/filters';

/**
 * Bootstrap
 */
(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: 'http://localhost:3001' },
  });

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
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Run!
  await app.listen(configService.get('app.port', 3000));
})();
