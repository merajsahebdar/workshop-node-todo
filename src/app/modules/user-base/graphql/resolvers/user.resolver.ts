import { UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { GraphQLBoolean } from 'graphql';
import { AppInputError } from '../../../../errors';
import { GqlValidationPipe } from '../../../../pipes';
import { UserPolicyBuilder, UserPolicyAction } from '../../access-control';
import { UserEntity } from '../../database';
import {
  JwtGuard,
  PolicyGuard,
  GetUserQuery,
  VerifyUserCommand,
  CheckUserEmailAvailabilityCommand,
} from '../../logic';
import { CheckUserEmailAvailabilityInput, VerifyUserInput } from '../inputs';
import { UserType } from '../types';

/**
 * User Resolver
 */
@Resolver(() => UserType)
@UsePipes(new GqlValidationPipe())
export class UserResolver {
  /**
   * Constructor
   *
   * @param {QueryBus} queryBus
   * @param {CommandBus} commandBus
   */
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  /**
   * Check whether the provided email address is available for registeration
   *  or not.
   *
   * @param {CheckUserEmailAvailabilityInput} input
   * @returns
   */
  @Mutation(() => GraphQLBoolean)
  async isUserEmailAvailable(
    @Args('input') input: CheckUserEmailAvailabilityInput,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new CheckUserEmailAvailabilityCommand(input),
    );
  }

  /**
   * Verify User
   *
   * @param {VerifyUserInput} input
   * @returns
   */
  @Mutation(() => GraphQLBoolean)
  @UseGuards(JwtGuard)
  async verifyUser(@Args('input') input: VerifyUserInput): Promise<boolean> {
    try {
      return await this.commandBus.execute(new VerifyUserCommand(input));
    } catch (error) {
      if (error instanceof AppInputError) {
        throw new UserInputError(error.message);
      }

      throw error;
    }
  }

  /**
   * Get the user by id.
   *
   * @param {string} id
   * @returns
   */
  @Query(() => UserType)
  @UseGuards(
    JwtGuard,
    PolicyGuard(UserPolicyBuilder, ({ can, args: { id } }) => {
      can(UserPolicyAction.READ, ['typeorm', UserEntity, { id }]);
    }),
  )
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
