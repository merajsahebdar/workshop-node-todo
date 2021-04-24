import { JwtService } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import {
  AccountEntity,
  EmailEntity,
  RefreshTokenEntity,
  UserEntity,
} from '../entities';
import { AccountService } from './account.service';
import { EmailService } from './email.service';
import { UserService } from './user.service';

// SignUp Service Response
export type SignUpServiceResponse = {
  user: UserEntity;
  email: EmailEntity;
  account: AccountEntity;
};

/**
 * Auth Service
 */
@Injectable()
export class AuthService {
  /**
   * Account Service
   */
  @Inject(AccountService)
  private accountService: AccountService;

  /**
   * User Service
   */
  @Inject(UserService)
  private userService: UserService;

  /**
   * Email Service
   */
  @Inject(EmailService)
  private emailService: EmailService;

  /**
   * Jwt Service
   */
  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * Sign Up
   *
   * @param {ISignUpInput} input
   * @returns
   */
  async signUp(
    userEntityLike: DeepPartial<UserEntity>,
    emailEntityLike: DeepPartial<EmailEntity>,
    accountEntityLike: DeepPartial<AccountEntity>,
  ): Promise<SignUpServiceResponse> {
    const user = await this.userService.createUser({
      isActivated: true,
      isBlocked: false,
      ...userEntityLike,
    });

    const email = await this.emailService.createEmail({
      isPrimary: true,
      isVerified: false,
      user,
      ...emailEntityLike,
    });

    const account = await this.accountService.createAccount({
      user,
      ...accountEntityLike,
    });

    return { user, email, account };
  }

  /**
   * Sign a new access token for provided user.
   *
   * @param {UserEntity} user
   * @returns
   */
  signAccessToken(user: UserEntity): string {
    return this.jwtService.signToken({ uid: user.id, sub: user.toType() });
  }

  /**
   * Sign a new refresh token.
   *
   * @param {RefreshTokenEntity} refreshToken
   * @returns
   */
  signRefreshToken(refreshToken: RefreshTokenEntity): string {
    return this.jwtService.signToken({
      uid: refreshToken.user.id,
      dip: refreshToken.clientIp,
      did: refreshToken.userAgent,
      ver: refreshToken.id,
    });
  }
}
