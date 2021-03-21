import { UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { AppInputError } from '../../../../../errors/app-input.error';
import { JwtGuard } from '../../logic/guards/jwt.guard';
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
  @UseGuards(JwtGuard)
  async user(@Args('id') id: string): Promise<UserType> {
    try {
      return await this.queryBus.execute(new GetUserQuery(id));
    } catch (error) {
      if (error instanceof AppInputError) {
        throw new UserInputError(error.message);
      }

      throw error;
    }
  }
}
