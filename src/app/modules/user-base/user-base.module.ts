import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPolicyBuilder } from './access-control';
import { RefreshTokenEntity, UserEntity } from './database';
import { AuthResolver, UserResolver } from './graphql';
import {
  VerifyUserCommandHandler,
  GetUserQueryHandler,
  CheckUserEmailAvailabilityCommandHandler,
  SignAccessTokenCommandHandler,
  SignInCommandHandler,
  SignUpCommandHandler,
  SendUserVerificationEmailCommandHandler,
  RegisterRefreshTokenCommandHandler,
  CookieService,
  SignedParamsService,
  UserService,
  JwtService,
  HashService,
  MailerQueueProcessor,
  JwtStrategy,
  Policy,
  UserSaga,
} from './logic';

/**
 * User Base Module
 */
@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({ name: 'mailer' }),
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
  ],
  providers: [
    MailerQueueProcessor,
    SignedParamsService,
    UserService,
    JwtService,
    HashService,
    CookieService,
    JwtStrategy,
    Policy,
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
  ],
})
export class UserBaseModule {}
