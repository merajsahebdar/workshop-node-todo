import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth';
import {
  jwtConfig,
  redisConfig,
  commonConfig,
  createApolloLogger,
  CommonModule,
  mailerConfig,
} from './common';
import { accountConfig, AccountModule } from './account';

/**
 * App Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [accountConfig, commonConfig, redisConfig, jwtConfig, mailerConfig],
      isGlobal: true,
    }),
    // GraphQL
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment =
          configService.get('common.env', 'development') === 'development';

        return {
          playground: isDevelopment,
          path: '/',
          logger: createApolloLogger('ApolloFederation'),
          autoSchemaFile: true,
          tracing: isDevelopment,
          context: ({ req, res }) => ({ req, res }),
        };
      },
    }),
    // CQRS
    CqrsModule,
    // App Modules
    AuthModule.forRoot(),
    CommonModule.forRoot(),
    AccountModule,
  ],
  providers: [],
})
export class AppModule {}
