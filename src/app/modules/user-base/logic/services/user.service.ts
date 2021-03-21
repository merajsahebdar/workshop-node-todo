import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppInputError } from '../../../../../errors/app-input.error';
import { isUniqueConstraintError } from '../../../../../utils/is-unique-constraint-error.util';
import { UserEntity } from '../../database/entities/user.entity';
import { UsersRepository } from '../../database/repositories/users.repository';
import { ISignInInput } from '../../interfaces/sign-in.input';
import { ISignUpInput } from '../../interfaces/sign-up.input';
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
    private jwtService: JwtService,
  ) {}

  /**
   * Find a user using the provided id.
   *
   * @param {string} id
   * @returns
   */
  async findById(id: string): Promise<UserEntity> {
    return this.users.findOneOrFail(id);
  }

  /**
   * Find a user using the provided email.
   *
   * @param {string} email
   * @returns
   */
  async findByEmail(email: string): Promise<UserEntity> {
    return this.users.findOneOrFail({
      where: { email },
      order: { email: 'DESC' },
    });
  }

  /**
   * Sign In
   *
   * @param {ISignInInput} input
   * @throws {AppInputError} in case of providing a wrong password.
   * @returns
   */
  async signIn(input: ISignInInput): Promise<string> {
    const user = await this.findByEmail(input.email);

    if (!(await user.comparePassword(input.password))) {
      throw new AppInputError();
    }

    return this.signToken(user);
  }

  /**
   * Sign Up
   *
   * @param {ISignUpInput} input
   * @throws {AppInputError} in case of the provided email exists.
   * @returns
   */
  async signUp(input: ISignUpInput): Promise<string> {
    try {
      const user = await this.users.save(
        this.users.create({
          ...input,
          isActivated: true,
          isBlocked: false,
          isVerified: false,
        }),
      );

      return this.signToken(user);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppInputError();
      }

      throw error;
    }
  }

  /**
   * Sign a new token for provided user.
   *
   * @param {UserEntity} user
   * @returns
   */
  private signToken(user: UserEntity): string {
    return this.jwtService.signToken({ uid: user.id, sub: user.toPlain() });
  }
}
