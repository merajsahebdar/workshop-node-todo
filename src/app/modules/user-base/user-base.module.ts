import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPolicyBuilder } from './access-control/policy-builders/user.policy-builder';
import { RefreshTokenEntity } from './database/entities/refresh-token.entity';
import { UserEntity } from './database/entities/user.entity';
import { AuthResolver } from './graphql/resolvers/auth.resolver';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { SignAccessTokenCommandHandler } from './logic/handlers/sign-access-token.command.handler';
import { Policy } from './logic/factories/policy.factory';
import { GetUserQueryHandler } from './logic/handlers/get-user.query.handler';
import { RefreshTokenRegistererCommandHandler } from './logic/handlers/refresh-token-registerer.command.handler';
import { SendUserVerificationEmailCommandHandler } from './logic/handlers/send-user-verification-email.command.handler';
import { SignInCommandHandler } from './logic/handlers/sign-in.command.handler';
import { SignUpCommandHandler } from './logic/handlers/sign-up.command.handler';
import { UserEmailAvailabilityCheckCommandHandler } from './logic/handlers/user-email-availability-check.handler';
import { VerifyUserCommandHandler } from './logic/handlers/verify-user.command.handler';
import { MailerQueueProcessor } from './logic/queue-processors/mailer.queue-processor';
import { UserSaga } from './logic/sagas/user.saga';
import { CookieService } from './logic/services/cookie.service';
import { HashService } from './logic/services/hash.service';
import { JwtService } from './logic/services/jwt.service';
import { SignedParamsService } from './logic/services/signed-params.service';
import { UserService } from './logic/services/user.service';
import { JwtStrategy } from './logic/strategies/jwt.strategy';

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
    UserEmailAvailabilityCheckCommandHandler,
    SignInCommandHandler,
    SignUpCommandHandler,
    SignAccessTokenCommandHandler,
    SendUserVerificationEmailCommandHandler,
    RefreshTokenRegistererCommandHandler,
    VerifyUserCommandHandler,
    UserSaga,
    UserResolver,
    AuthResolver,
  ],
})
export class UserBaseModule {}
