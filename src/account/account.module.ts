import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
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
 * Account Module
 */
@Module({
  imports: [
    // Third-party Modules
    // CQRS
    CqrsModule,
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
export class AccountModule {}
