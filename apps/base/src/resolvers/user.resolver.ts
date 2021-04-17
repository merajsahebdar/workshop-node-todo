import {
  AuthGuard,
  AcGuard,
  JwtAuthStrategy,
  UsePermissions,
  RbacStrategy,
} from '@app/auth';
import { GqlValidationPipe, GqlAppInputErrorFilter } from '@app/common';
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
import {
  VerifyUserCommand,
  CheckUserEmailAvailabilityCommand,
} from '../commands';
import { CheckUserEmailAvailabilityInput, VerifyUserInput } from '../inputs';
import { UserType } from '../types';
import { AccountType } from '../types/account.type';
import { GetUserQuery } from '../queries';
import { AccountService } from '../services';
import { UserArgs } from '../args';

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
  @UseGuards(AuthGuard(JwtAuthStrategy))
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
  @UseGuards(AuthGuard(JwtAuthStrategy), AcGuard(RbacStrategy))
  @UsePermissions(({ id }: UserArgs) => [`users:${id}`, 'read'])
  async getUser(@Args() { id }: UserArgs): Promise<UserType> {
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
