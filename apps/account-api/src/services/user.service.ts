import { AppInputError, JwtService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindConditions } from 'typeorm';
import { UserEntity, RefreshTokenEntity, EmailEntity } from '../entities';
import { ISignInInput, ISignUpInput } from '../interfaces';
import {
  EmailsRepository,
  RefreshTokensRepository,
  UsersRepository,
} from '../repositories';

/**
 * User Service
 */
@Injectable()
export class UserService {
  /**
   * Constructor
   *
   * @param {UsersRepository} users
   */
  constructor(
    @InjectRepository(UserEntity) private users: UsersRepository,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokens: RefreshTokensRepository,
    @InjectRepository(EmailEntity) private emails: EmailsRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Check whether is any user exists with given conditions or not.
   *
   * @param {FindConditions<UserEntity>} conditions
   * @returns
   */
  async userExists(conditions: FindConditions<UserEntity>): Promise<boolean> {
    return (await this.users.count({ where: conditions })) > 0;
  }

  /**
   * Check whether is any email exists with given conditions or not.
   *
   * @param {FindConditions<EmailEntity>} conditions
   * @returns
   */
  async emailExists(conditions: FindConditions<EmailEntity>): Promise<boolean> {
    return (await this.emails.count({ where: conditions })) > 0;
  }

  /**
   * Check whether is any refresh token exists with given conditions or not.
   *
   * @param {FindConditions<UserEntity>} conditions
   * @returns
   */
  async refreshTokenExists(
    conditions: FindConditions<RefreshTokenEntity>,
  ): Promise<boolean> {
    return (await this.refreshTokens.count({ where: conditions })) > 0;
  }

  /**
   * Find a user using the provided id.
   *
   * @param {string} id
   * @throws {AppInputError} in case of non-existing user for
   *  the provided id.
   * @returns
   */
  async findUserById(id: string): Promise<UserEntity> {
    const user = await this.users
      .createQueryBuilder('User')
      .where('User.id = :id', { id })
      .getOne();

    if (user) {
      return user;
    }

    throw new AppInputError(`No user found with id: '${id}'`);
  }

  /**
   * Find emails using the provided user id.
   *
   * @param {string} userId
   * @returns
   */
  async findEmailsByUserId(userId: string): Promise<EmailEntity[]> {
    return this.emails
      .createQueryBuilder('Email')
      .leftJoin(UserEntity, 'User', 'User.id = Email.user')
      .where('User.id = :userId', { userId })
      .orderBy('Email.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Find a user email using the provided id.
   *
   * @param {string} id
   * @throws {AppInputError} in case of non-existing user for
   *  the provided id.
   * @returns
   */
  async findEmailById(id: string): Promise<EmailEntity> {
    const email = await this.emails
      .createQueryBuilder('Email')
      .where('Email.id = :id', { id })
      .getOne();

    if (email) {
      return email;
    }

    throw new AppInputError(`No user email found with id: '${id}'`);
  }

  /**
   * Find a user using the provided email.
   *
   * @param {string} email
   * @throws {AppInputError} in case of non-existing user for
   *  the provided email.
   * @returns
   */
  async findUserByEmailAddress(address: string): Promise<UserEntity> {
    const user = await this.users
      .createQueryBuilder('User')
      .leftJoin(EmailEntity, 'Email', 'Email.user = User.id')
      .where('Email.address = :address', { address })
      .andWhere('Email.isPrimary = :isPrimary', { isPrimary: true })
      .getOne();

    if (user) {
      return user as any;
    }

    throw new AppInputError(`No user found with email address: '${address}'`);
  }

  /**
   * Sign In
   *
   * @param {ISignInInput} input
   * @throws {AppInputError} in case of providing a wrong password.
   * @returns
   */
  async signIn(input: ISignInInput): Promise<[UserEntity, string]> {
    const user = await this.findUserByEmailAddress(input.email);

    if (!(await user.comparePassword(input.password))) {
      throw new AppInputError('The provided password is not correct.');
    }

    return [user, this.signAccessToken(user)];
  }

  /**
   * Sign Up
   *
   * @param {ISignUpInput} input
   * @returns
   */
  async signUp(
    input: ISignUpInput,
  ): Promise<[UserEntity, EmailEntity, string]> {
    const user = await this.users.save(
      this.users.create({
        password: input.password,
        isActivated: true,
        isBlocked: false,
      }),
    );

    const email = await this.emails.save(
      this.emails.create({
        user: user,
        address: input.email.address,
        isPrimary: true,
        isVerified: false,
      }),
    );

    return [user, email, this.signAccessToken(user)];
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
   * Create Refresh Token
   *
   * @param {DeepPartial<RefreshTokenEntity>} props
   * @returns
   */
  async createRefreshToken(
    props: DeepPartial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokens.save(this.refreshTokens.create(props));
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

  /**
   * Toggle Verification
   *
   * @param {EmailEntity} user
   * @return
   */
  async toggleVerification(email: EmailEntity): Promise<void> {
    email.isVerified = !email.isVerified;
    await this.users.save(email);
  }
}
