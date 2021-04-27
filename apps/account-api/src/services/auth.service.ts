import { JwtService } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeepPartial, EntityManager } from 'typeorm';
import {
  AccountEntity,
  EmailEntity,
  RefreshTokenEntity,
  UserEntity,
} from '../entities';
import {
  AccountsRepository,
  EmailsRepository,
  UsersRepository,
} from '../repositories';

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
   * Accounts Repository
   */
  @InjectRepository(AccountEntity)
  private accounts: AccountsRepository;

  /**
   * Users Repository
   */
  @InjectRepository(UserEntity)
  private users: UsersRepository;

  /**
   * Emails Repository
   */
  @InjectRepository(EmailEntity)
  private emails: EmailsRepository;

  /**
   * Jwt Service
   */
  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * Constructor
   *
   * @param entityManager
   */
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * Sign Up
   *
   * @param userEntityLike
   * @param emailEntityLike
   * @param accountEntityLike
   * @returns
   */
  async signUp(
    userEntityLike: DeepPartial<UserEntity>,
    emailEntityLike: DeepPartial<EmailEntity>,
    accountEntityLike: DeepPartial<AccountEntity>,
  ): Promise<SignUpServiceResponse> {
    return this.entityManager.transaction(async (entityManager) => {
      const user = await entityManager.save(
        this.users.create({
          isActivated: true,
          isBlocked: false,
          ...userEntityLike,
        }),
      );

      const email = await entityManager.save(
        this.emails.create({
          isPrimary: true,
          isVerified: false,
          user,
          ...emailEntityLike,
        }),
      );

      const account = await entityManager.save(
        this.accounts.create({
          user,
          ...accountEntityLike,
        }),
      );

      return { user, email, account };
    });
  }

  /**
   * Sign a new access token for provided user.
   *
   * @param user
   * @returns
   */
  signAccessToken(user: UserEntity): string {
    return this.jwtService.signToken({ uid: user.id, sub: user.toType() });
  }

  /**
   * Sign a new refresh token.
   *
   * @param refreshToken
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
