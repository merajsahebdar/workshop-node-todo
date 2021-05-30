import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  AuthGuard,
  AcGuard,
  JwtAuthStrategy,
  UsePermissions,
  RbacStrategy,
} from '../../auth';
import { GqlValidationPipe, GqlAppInputErrorFilter } from '../../common';
import { GraphUser, GraphProfile, GraphEmail } from '../types';
import {
  GetUserProfileQuery,
  GetUserEmailsQuery,
  GetUserQuery,
} from '../queries';
import { UserArgs } from '../args';

/**
 * User Resolver
 */
@Resolver(() => GraphUser)
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
   * @param args
   * @returns
   */
  @Query(() => GraphUser, { name: 'user' })
  @UseGuards(AuthGuard(JwtAuthStrategy), AcGuard(RbacStrategy))
  @UsePermissions(({ id }: UserArgs) => [`users:${id}`, 'read'])
  async getUser(@Args() { id }: UserArgs): Promise<GraphUser> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  /**
   * User's Profile
   *
   * @param parent
   * @returns
   */
  @ResolveField(() => GraphProfile, { name: 'profile' })
  async getProfile(@Parent() { id: userId }: GraphUser): Promise<GraphProfile> {
    return this.queryBus.execute(new GetUserProfileQuery(userId));
  }

  /**
   * User's Emails
   *
   * @param parent
   * @returns
   */
  @ResolveField(() => [GraphEmail], { name: 'emails' })
  async getEmails(@Parent() { id: userId }: GraphUser): Promise<GraphEmail[]> {
    return this.queryBus.execute(new GetUserEmailsQuery(userId));
  }
}
