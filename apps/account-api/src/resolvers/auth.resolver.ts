import {
  AuthGuard,
  AuthorizedUser,
  RefreshTokenAuthStrategy,
  REFRESH_TOKEN_COOKIE_KEY,
} from '@app/auth';
import {
  CookieService,
  GqlAppInputErrorFilter,
  GqlValidationPipe,
  IAppContext,
} from '@app/common';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthorizeOAuthCommand,
  RegisterRefreshTokenCommand,
  RequestOAuthCommand,
  SignAccessTokenCommand,
  SignInCommand,
  SignUpCommand,
} from '../commands';
import { UserEntity } from '../entities';
import {
  AuthorizeOAuthInput,
  RequestOAuthInput,
  SignInInput,
  SignUpInput,
} from '../inputs';

/**
 * Auth Resolver
 */
@Resolver()
@UsePipes(new GqlValidationPipe())
@UseFilters(new GqlAppInputErrorFilter())
export class AuthResolver {
  /**
   * Constructor
   *
   * @param {QueryBus} queryBus
   * @param {CommandBus} commandBus
   * @param {CookieService} cookieService
   */
  constructor(
    private commandBus: CommandBus,
    private cookieService: CookieService,
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
}
