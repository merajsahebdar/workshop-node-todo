import { AppInputError } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { UserEntity, EmailEntity } from '../entities';
import { UsersRepository } from '../repositories';

/**
 * User Service
 */
@Injectable()
export class UserService {
  /**
   * Users Repository
   */
  @InjectRepository(UserEntity)
  private users: UsersRepository;

  /**
   * Create User
   *
   * @param {DeepPartial<UserEntity>} props
   * @returns
   */
  async createUser(props: DeepPartial<UserEntity>): Promise<UserEntity> {
    return this.users.save(this.users.create(props));
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
   * Find a user using the provided email address.
   *
   * @param {string} address
   * @throws {AppInputError} in case of non-existing user for
   *  the provided email.
   * @returns
   */
  async findByEmailAddress(address: string): Promise<UserEntity> {
    const user = await this.users
      .createQueryBuilder('User')
      .leftJoin(EmailEntity, 'Email', 'Email.user = User.id')
      .where('Email.address = :address', { address })
      .andWhere('Email.isPrimary = :isPrimary', { isPrimary: true })
      .getOne();

    if (user) {
      return user;
    }

    throw new AppInputError(`No user found with email address: '${address}'.`);
  }
}
