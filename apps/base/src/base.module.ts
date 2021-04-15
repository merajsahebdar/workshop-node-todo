import { AuthModule } from '@app/auth';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  appConfig,
  redisConfig,
  mailerConfig,
  typeormConfig,
  jwtConfig,
} from './configs';
import { UserPolicyBuilder } from './policy-builders';
import { AccountEntity, RefreshTokenEntity, UserEntity } from './entities';
import { AuthResolver, UserResolver } from './resolvers';
import {
  VerifyUserCommandHandler,
  GetUserQueryHandler,
  CheckUserEmailAvailabilityCommandHandler,
  SignAccessTokenCommandHandler,
  SignInCommandHandler,
  SignUpCommandHandler,
  SendUserVerificationEmailCommandHandler,
  RegisterRefreshTokenCommandHandler,
} from './handlers';
import { UserSaga } from './sagas';
import { IsUniqueConstraint } from '@app/shared';
import { JwtStrategy } from './strategies';
import {
  AccountService,
  CookieService,
  HashService,
  JwtService,
  SignedParamsService,
  UserService,
} from './services';
import { MailerQueueProcessor } from './queue-processors';

/**
 * User Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [appConfig, redisConfig, mailerConfig, typeormConfig, jwtConfig],
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
        template: {
          adapter: new PugAdapter(),
        },
      }),
    }),
    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('typeorm.host'),
        port: configService.get('typeorm.port'),
        username: configService.get('typeorm.username'),
        password: configService.get('typeorm.password'),
        database: configService.get('typeorm.database'),
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    // GraphQL
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment =
          configService.get('app.env', 'development') === 'development';

        return {
          playground: isDevelopment,
          path: '/',
          autoSchemaFile: true,
          tracing: isDevelopment,
          context: ({ req, res }) => ({ req, res }),
        };
      },
    }),
    // Application Modules
    AuthModule,
    CqrsModule,
    BullModule.registerQueue({ name: 'mailer' }),
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity, AccountEntity]),
  ],
  providers: [
    MailerQueueProcessor,
    SignedParamsService,
    UserService,
    AccountService,
    JwtService,
    HashService,
    CookieService,
    JwtStrategy,
    UserPolicyBuilder,
    GetUserQueryHandler,
    CheckUserEmailAvailabilityCommandHandler,
    SignInCommandHandler,
    SignUpCommandHandler,
    SignAccessTokenCommandHandler,
    SendUserVerificationEmailCommandHandler,
    RegisterRefreshTokenCommandHandler,
    VerifyUserCommandHandler,
    UserSaga,
    UserResolver,
    AuthResolver,
    IsUniqueConstraint,
  ],
})
export class BaseModule {}
