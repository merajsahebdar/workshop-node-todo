import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './database/entities/user.entity';
import { AuthResolver } from './graphql/resolvers/auth.resolver';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { GetUserQueryHandler } from './logic/handlers/get-user.query.handler';
import { SignInCommandHandler } from './logic/handlers/sign-in.command.handler';
import { SignUpCommandHandler } from './logic/handlers/sign-up.command.handler';
import { JwtService } from './logic/services/jwt.service';
import { UserService } from './logic/services/user.service';

/**
 * User Base Module
 */
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    JwtService,
    GetUserQueryHandler,
    SignInCommandHandler,
    SignUpCommandHandler,
    UserResolver,
    AuthResolver,
  ],
})
export class UserBaseModule {}
