import { AuthModule } from '@app/auth';
import {
  IsUniqueConstraint,
  CommonModule,
  jwtConfig,
  redisConfig,
  typeormConfig,
  commonConfig,
  createApolloLogger,
} from '@app/common';
import { MailingClientModule } from '@app/mailing-lib';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { appConfig } from './configs';
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
import { AccountService, CookieService, UserService } from './services';

/**
 * Account API Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [appConfig, commonConfig, redisConfig, typeormConfig, jwtConfig],
      isGlobal: true,
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
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity, AccountEntity]),
    // GraphQL
    GraphQLFederationModule.forRootAsync({
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
    CommonModule,
    AuthModule,
    MailingClientModule,
  ],
  providers: [
    UserService,
    AccountService,
    CookieService,
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
export class AccountApiModule {}
