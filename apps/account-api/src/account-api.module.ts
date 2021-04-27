import {
  AuthModule,
  CasbinManagementModule,
  oauthConfig,
  OAuthModule,
} from '@app/auth';
import {
  CommonModule,
  jwtConfig,
  redisConfig,
  typeormConfig,
  commonConfig,
  createApolloLogger,
  TypeOrmConnectionModule,
} from '@app/common';
import { MailingClientModule } from '@app/mailing-lib';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './configs';
import {
  AccountEntity,
  EmailEntity,
  OAuthTicketEntity,
  RefreshTokenEntity,
  UserEntity,
} from './entities';
import { AuthResolver, EmailResolver, UserResolver } from './resolvers';
import {
  VerifyEmailCommandHandler,
  GetUserQueryHandler,
  CheckEmailAvailabilityCommandHandler,
  SignAccessTokenCommandHandler,
  SignInCommandHandler,
  SignUpCommandHandler,
  RegisterRefreshTokenCommandHandler,
  SendEmailVerificationMessageCommandHandler,
  GetUserAccountQueryHandler,
  GetUserEmailsQueryHandler,
} from './handlers';
import { UserSaga } from './sagas';
import {
  AccountService,
  AuthService,
  EmailService,
  OAuthTicketService,
  RefreshTokenService,
  UserService,
} from './services';
import { RequestOAuthCommandHandler } from './handlers/request-oauth.command.handler';
import { AuthorizeOAuthCommandHandler } from './handlers/authorize-oauth.command.handler';

/**
 * Account API Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [
        appConfig,
        commonConfig,
        oauthConfig,
        redisConfig,
        typeormConfig,
        jwtConfig,
      ],
      isGlobal: true,
    }),
    // Database
    TypeOrmModule.forFeature([
      UserEntity,
      EmailEntity,
      OAuthTicketEntity,
      RefreshTokenEntity,
      AccountEntity,
    ]),
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
    TypeOrmConnectionModule,
    CasbinManagementModule,
    OAuthModule,
    MailingClientModule,
  ],
  providers: [
    // Services
    UserService,
    AccountService,
    EmailService,
    OAuthTicketService,
    RefreshTokenService,
    AuthService,
    // Handlers
    GetUserQueryHandler,
    GetUserAccountQueryHandler,
    GetUserEmailsQueryHandler,
    CheckEmailAvailabilityCommandHandler,
    SignInCommandHandler,
    SignUpCommandHandler,
    RequestOAuthCommandHandler,
    AuthorizeOAuthCommandHandler,
    SignAccessTokenCommandHandler,
    SendEmailVerificationMessageCommandHandler,
    RegisterRefreshTokenCommandHandler,
    VerifyEmailCommandHandler,
    // Sagas
    UserSaga,
    // Resolvers
    UserResolver,
    EmailResolver,
    AuthResolver,
  ],
})
export class AccountApiModule {}
