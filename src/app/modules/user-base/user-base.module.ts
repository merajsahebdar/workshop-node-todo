import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { AuthResolver } from './graphql/resolvers/auth.resolver';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { GetUserQueryHandler } from './logic/handlers/get-user.query.handler';
import { SendUserVerificationEmailCommandHandler } from './logic/handlers/send-user-verification-email.command.handler';
import { SignInCommandHandler } from './logic/handlers/sign-in.command.handler';
import { SignUpCommandHandler } from './logic/handlers/sign-up.command.handler';
import { UserEmailAvailabilityCheckCommandHandler } from './logic/handlers/user-email-availability-check.handler';
import { VerifyUserCommandHandler } from './logic/handlers/verify-user.command.handler';
import { MailerQueueProcessor } from './logic/queue-processors/mailer.queue-processor';
import { UserSaga } from './logic/sagas/user.saga';
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
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    MailerQueueProcessor,
    SignedParamsService,
    UserService,
    JwtService,
    HashService,
    JwtStrategy,
    GetUserQueryHandler,
    UserEmailAvailabilityCheckCommandHandler,
    SignInCommandHandler,
    SignUpCommandHandler,
    SendUserVerificationEmailCommandHandler,
    VerifyUserCommandHandler,
    UserSaga,
    UserResolver,
    AuthResolver,
  ],
})
export class UserBaseModule {}
