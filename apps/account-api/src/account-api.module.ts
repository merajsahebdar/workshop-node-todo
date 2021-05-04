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
  commonConfig,
  createApolloLogger,
} from '@app/common';
import { MailingClientModule } from '@app/mailing-lib';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { appConfig } from './configs';
import {
  AuthResolver,
  EmailResolver,
  ProfileResolver,
  UserResolver,
} from './resolvers';
import {
  VerifyEmailCommandHandler,
  GetUserQueryHandler,
  CheckEmailAvailabilityCommandHandler,
  SignAccessTokenCommandHandler,
  SignInCommandHandler,
  SignUpCommandHandler,
  RegisterRefreshTokenCommandHandler,
  SendEmailVerificationMessageCommandHandler,
  GetUserProfileQueryHandler,
  GetUserEmailsQueryHandler,
  RequestOauthCommandHandler,
  AuthorizeOauthCommandHandler,
} from './handlers';
import { UserSaga } from './sagas';
import { AuthService } from './services';

/**
 * Account API Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [appConfig, commonConfig, oauthConfig, redisConfig, jwtConfig],
      isGlobal: true,
    }),
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
    CasbinManagementModule,
    OAuthModule,
    MailingClientModule,
  ],
  providers: [
    // Services
    AuthService,
    // Handlers
    GetUserQueryHandler,
    GetUserProfileQueryHandler,
    GetUserEmailsQueryHandler,
    CheckEmailAvailabilityCommandHandler,
    SignInCommandHandler,
    SignUpCommandHandler,
    RequestOauthCommandHandler,
    AuthorizeOauthCommandHandler,
    SignAccessTokenCommandHandler,
    SendEmailVerificationMessageCommandHandler,
    RegisterRefreshTokenCommandHandler,
    VerifyEmailCommandHandler,
    // Sagas
    UserSaga,
    // Resolvers
    UserResolver,
    EmailResolver,
    ProfileResolver,
    AuthResolver,
  ],
})
export class AccountApiModule {}
