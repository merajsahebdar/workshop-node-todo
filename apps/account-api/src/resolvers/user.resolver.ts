import {
  AuthGuard,
  AcGuard,
  JwtAuthStrategy,
  UsePermissions,
  RbacStrategy,
  REFRESH_TOKEN_COOKIE_KEY,
  RefreshTokenAuthStrategy,
  AuthorizedUser,
} from '@app/auth';
import {
  GqlValidationPipe,
  GqlAppInputErrorFilter,
  IAppContext,
  CookieService,
} from '@app/common';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';
import {
  VerifyEmailCommand,
  CheckEmailAvailabilityCommand,
  RegisterRefreshTokenCommand,
  SignUpCommand,
  SignInCommand,
  SignAccessTokenCommand,
} from '../commands';
import {
  CheckEmailAvailabilityInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from '../inputs';
import { EmailType, UserType } from '../types';
import { AccountType } from '../types/account.type';
import { GetUserQuery } from '../queries';
import { AccountService, UserService } from '../services';
import { UserArgs } from '../args';
import { UserEntity } from '../entities';
import { RequestOAuthInput } from '../inputs/request-oauth.input';
import { RequestOAuthCommand } from '../commands/request-oauth.command';
import { AuthorizeOAuthInput } from '../inputs/authorize-oauth.input';
import { AuthorizeOAuthCommand } from '../commands/authorize-oauth.command';

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
   * @param {UserService} userService
   * @param {AccountService} accountService
   */
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    private cookieService: CookieService,
    private userService: UserService,
    private accountService: AccountService,
  ) {}

  /**
   * Return a new signed access token from given refresh token.
   *
   * @param {UserEntity} user
   * @returns
   */
  @UseGuards(AuthGuard(RefreshTokenAuthStrategy))
  @Mutation(() => String)
  async refreshToken(@AuthorizedUser() user: UserEntity): Promise<string> {
    return this.commandBus.execute(new SignAccessTokenCommand(user));
  }

  /**
   * Sign In
   *
   * @param {SignInInput} input
   * @returns
   */
  @Mutation(() => String)
  async signIn(
    @Context() { req }: IAppContext,
    @Args('input') input: SignInInput,
  ): Promise<string> {
    // Login
    const [user, accessToken] = await this.commandBus.execute(
      new SignInCommand(input),
    );

    // Register refresh token
    const refreshToken = await this.commandBus.execute(
      new RegisterRefreshTokenCommand(
        user,
        req.clientIp,
        req.headers['user-agent'],
      ),
    );

    this.cookieService.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

    return accessToken;
  }

  /**
   * Sign Up
   *
   * @param {SignUpInput} input
   * @returns
   */
  @Mutation(() => String)
  async signUp(
    @Context() { req }: IAppContext,
    @Args('input') input: SignUpInput,
  ): Promise<string> {
    // Register
    const [user, accessToken] = await this.commandBus.execute(
      new SignUpCommand(input),
    );

    // Register refresh token
    const refreshToken = await this.commandBus.execute(
      new RegisterRefreshTokenCommand(
        user,
        req.clientIp,
        req.headers['user-agent'],
      ),
    );

    this.cookieService.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

    return accessToken;
  }

  /**
   * Check whether the provided email address is available for registeration
   *  or not.
   *
   * @param {CheckUserEmailAvailabilityInput} input
   * @returns
   */
  @Mutation(() => GraphQLBoolean)
  async isUserEmailAvailable(
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

  /**
   * Request for oauth sign-in (or sign-up).
   *
   * @param {RequestOAuthInput} input
   * @returns
   */
  @Mutation(() => String)
  async requestOAuth(@Args('input') input: RequestOAuthInput): Promise<string> {
    return this.commandBus.execute(new RequestOAuthCommand(input));
  }

  /**
   * Authorize oauth response.
   *
   * @param {AuthorizeOAuthInput} input
   * @returns
   */
  @Mutation(() => String)
  async authorizeOAuth(
    @Context() { req }: IAppContext,
    @Args('input') input: AuthorizeOAuthInput,
  ): Promise<string> {
    const [user, accessToken] = await this.commandBus.execute(
      new AuthorizeOAuthCommand(input),
    );

    // Register refresh token
    const refreshToken = await this.commandBus.execute(
      new RegisterRefreshTokenCommand(
        user,
        req.clientIp,
        req.headers['user-agent'],
      ),
    );

    this.cookieService.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

    return accessToken;
  }

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
  async getAccount(@Parent() { id }: UserType): Promise<AccountType> {
    return this.accountService.findByUserId(id);
  }

  /**
   * User's Emails
   *
   * @param {UserType} parent
   * @returns
   */
  @ResolveField(() => [EmailType], { name: 'emails' })
  async getEmails(@Parent() { id }: UserType): Promise<EmailType[]> {
    return this.userService.findEmailsByUserId(id);
  }
}
