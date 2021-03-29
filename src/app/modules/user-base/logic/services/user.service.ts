import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions } from 'typeorm';
import { AppInputError } from '../../../../errors';
import {
  UsersRepository,
  RefreshTokensRepository,
  UserEntity,
  RefreshTokenEntity,
} from '../../database';
import { ISignInInput, ISignUpInput } from '../../typing';
import { HashService } from './hash.service';
import { JwtService } from './jwt.service';

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
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  /**
   * Check whether is any user exists with given conditions or not.
   *
   * @param {FindConditions<UserEntity>} conditions
   * @returns
   */
  async exists(conditions: FindConditions<UserEntity>): Promise<boolean> {
    return (await this.users.count({ where: conditions })) > 0;
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
  async findById(id: string): Promise<UserEntity> {
    const user = await this.users.findOne(id);

    if (user) {
      return user;
    }

    throw new AppInputError(`No user found with id: '${id}'`);
  }

  /**
   * Find a user using the provided email.
   *
   * @param {string} email
   * @throws {AppInputError} in case of non-existing user for
   *  the provided email.
   * @returns
   */
  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.users.findOne({
      where: { email },
      order: { email: 'DESC' },
    });

    if (user) {
      return user;
    }

    throw new AppInputError(`No user found with email: '${email}'`);
  }

  /**
   * Sign In
   *
   * @param {ISignInInput} input
   * @throws {AppInputError} in case of providing a wrong password.
   * @returns
   */
  async signIn(input: ISignInInput): Promise<[UserEntity, string]> {
    const user = await this.findByEmail(input.email);

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
  async signUp(input: ISignUpInput): Promise<[UserEntity, string]> {
    const user = await this.users.save(
      this.users.create({
        ...input,
        isActivated: true,
        isBlocked: false,
        isVerified: false,
      }),
    );

    return [user, this.signAccessToken(user)];
  }

  /**
   * Sign a new access token for provided user.
   *
   * @param {UserEntity} user
   * @returns
   */
  signAccessToken(user: UserEntity): string {
    return this.jwtService.signToken({ uid: user.id, sub: user.toPlain() });
  }

  /**
   * Sign a new refresh token for provided user.
   *
   * @param {UserEntity} user
   * @returns
   */
  async signRefreshToken(
    user: UserEntity,
    clientIp?: string,
    userAgent?: string,
  ): Promise<string> {
    const refreshToken = await this.refreshTokens.save(
      this.refreshTokens.create({ userId: user.id, userAgent, clientIp }),
    );

    return this.jwtService.signToken({
      uid: user.id,
      nip: clientIp,
      did: userAgent,
      ver: refreshToken.id,
    });
  }

  /**
   * Toggle Verification
   *
   * @param {UserEntity} user
   * @return
   */
  async toggleVerification(user: UserEntity): Promise<void> {
    user.isVerified = !user.isVerified;
    await this.users.save(user);
  }
}
