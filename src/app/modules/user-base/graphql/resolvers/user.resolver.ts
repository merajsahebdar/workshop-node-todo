import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { EntityNotFoundError } from 'typeorm';
import { GetUserQuery } from '../../logic/queries/get-user.query';
import { UserType } from '../types/user.type';

/**
 * User Resolver
 */
@Resolver(UserType)
export class UserResolver {
  /**
   * Constructor
   *
   * @param {QueryBus} queryBus
   */
  constructor(private queryBus: QueryBus) {}

  /**
   * Get the user by id.
   *
   * @param {string} id
   * @returns
   */
  @Query(() => UserType)
  async user(@Args('id') id: string): Promise<UserType> {
    try {
      return await this.queryBus.execute(new GetUserQuery(id));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UserInputError(`No user found with id: ${id}`);
      }

      throw error;
    }
  }
}
