import {
  AuthGuard,
  AcGuard,
  JwtAuthStrategy,
  UsePermissions,
  RbacStrategy,
} from '@app/auth';
import { GqlValidationPipe, GqlAppInputErrorFilter } from '@app/common';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { EmailType, UserType, AccountType } from '../types';
import {
  GetUserAccountQuery,
  GetUserEmailsQuery,
  GetUserQuery,
} from '../queries';
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
   * @param {CookieService} cookieService
   */
  constructor(private queryBus: QueryBus) {}

  /**
   * Get the user by id.
   *
   * @param {UserArgs} args
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
   * @param {UserType} parent
   * @returns
   */
  @ResolveField(() => AccountType, { name: 'account' })
  async getAccount(@Parent() { id: userId }: UserType): Promise<AccountType> {
    return this.queryBus.execute(new GetUserAccountQuery(userId));
  }

  /**
   * User's Emails
   *
   * @param {UserType} parent
   * @returns
   */
  @ResolveField(() => [EmailType], { name: 'emails' })
  async getEmails(@Parent() { id: userId }: UserType): Promise<EmailType[]> {
    return this.queryBus.execute(new GetUserEmailsQuery(userId));
  }
}
