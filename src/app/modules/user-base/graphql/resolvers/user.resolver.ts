import { UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { GraphQLBoolean } from 'graphql';
import { AppInputError } from '../../../../errors/app-input.error';
import { GqlValidationPipe } from '../../../../pipes/gql-validation.pipe';
import { UserEmailAvailabilityCheckCommand } from '../../logic/commands/user-email-availability-check.command';
import { JwtGuard } from '../../logic/guards/jwt.guard';
import { GetUserQuery } from '../../logic/queries/get-user.query';
import { UserEmailAvailabilityCheckInput } from '../inputs/user-email-availability-check.input';
import { UserType } from '../types/user.type';

/**
 * User Resolver
 */
@Resolver(UserType)
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
   * @param {UserEmailAvailabilityCheckInput} input
   * @returns
   */
  @Mutation(() => GraphQLBoolean)
  async isUserEmailAvailable(
    @Args('input') input: UserEmailAvailabilityCheckInput,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new UserEmailAvailabilityCheckCommand(input),
    );
  }

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
