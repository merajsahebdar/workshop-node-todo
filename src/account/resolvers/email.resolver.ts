import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';
import { AuthGuard, JwtAuthStrategy } from '../../auth';
import { GqlAppInputErrorFilter, GqlValidationPipe } from '../../common';
import { CheckEmailAvailabilityCommand, VerifyEmailCommand } from '../commands';
import { CheckEmailAvailabilityInput, VerifyEmailInput } from '../inputs';
import { GraphEmail } from '../types';

/**
 * Email Resolver
 */
@Resolver(() => GraphEmail)
@UsePipes(new GqlValidationPipe())
@UseFilters(new GqlAppInputErrorFilter())
export class EmailResolver {
  /**
   * Constructor
   *
   * @param {CommandBus} commandBus
   */
  constructor(private commandBus: CommandBus) {}

  /**
   * Check whether the provided email address is available for registeration
   *  or not.
   *
   * @param {CheckUserEmailAvailabilityInput} input
   * @returns
   */
  @Mutation(() => GraphQLBoolean)
  async checkEmailAvailability(
    @Args('input') input: CheckEmailAvailabilityInput,
  ): Promise<boolean> {
    return this.commandBus.execute(new CheckEmailAvailabilityCommand(input));
  }

  /**
   * Verify User
   *
   * @param {VerifyEmailInput} input
   * @returns
   */
  @Mutation(() => GraphQLBoolean)
  @UseGuards(AuthGuard(JwtAuthStrategy))
  async verifyEmail(@Args('input') input: VerifyEmailInput): Promise<boolean> {
    return this.commandBus.execute(new VerifyEmailCommand(input));
  }
}
