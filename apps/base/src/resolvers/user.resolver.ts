import { GqlValidationPipe, GqlAppInputErrorFilter } from '@app/shared';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';
import { UserPolicyBuilder } from '../policy-builders';
import { UserEntity } from '../entities';
import {
  VerifyUserCommand,
  CheckUserEmailAvailabilityCommand,
} from '../commands';
import { CheckUserEmailAvailabilityInput, VerifyUserInput } from '../inputs';
import { UserType } from '../types';
import { AccountType } from '../types/account.type';
import { JwtGuard, PolicyGuard } from '../guards';
import { UserPolicyAction } from '../actions';
import { GetUserQuery } from '../queries';
import { AccountService } from '../services';

/**
 * User Resolver
 */
@Resolver(() => UserType)
@UsePipes(new GqlValidationPipe())
@UseFilters(new GqlAppInputErrorFilter())
export class UserResolver {
  /**
   * Constructor
   *
   * @param {QueryBus} queryBus
   * @param {CommandBus} commandBus
   * @param {AccountService} accountService
   */
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    private accountService: AccountService,
  ) {}

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
    return this.commandBus.execute(new VerifyUserCommand(input));
  }

  /**
   * Get the user by id.
   *
   * @param {string} id
   * @returns
   */
  @Query(() => UserType, { name: 'user' })
  @UseGuards(
    JwtGuard,
    PolicyGuard(UserPolicyBuilder, ({ can, args: { id } }) => {
      can(UserPolicyAction.READ, ['typeorm', UserEntity, { id }]);
    }),
  )
  async getUser(@Args('id') id: string): Promise<UserType> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  /**
   * User's Account
   *
   * @returns
   */
  @ResolveField(() => AccountType, { name: 'account' })
  async getAccount(@Parent() { id }: UserType): Promise<AccountType> {
    return this.accountService.findByUserId(id);
  }
}
