import { User } from '@prisma/client';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthGuard,
  AuthorizedUser,
  RefreshTokenAuthStrategy,
  REFRESH_TOKEN_COOKIE_KEY,
} from '../../auth';
import {
  CookieService,
  GqlAppInputErrorFilter,
  GqlValidationPipe,
  IGqlContext,
} from '../../common';
import {
  AuthorizeOauthCommand,
  RegisterRefreshTokenCommand,
  RequestOauthCommand,
  SignAccessTokenCommand,
  SignInCommand,
  SignUpCommand,
} from '../commands';
import {
  AuthorizeOauthInput,
  RequestOauthInput,
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
   * @param commandBus
   * @param cookie
   */
  constructor(private commandBus: CommandBus, private cookie: CookieService) {}

  /**
   * Return a new signed access token from given refresh token.
   *
   * @param user
   * @returns
   */
  @UseGuards(AuthGuard(RefreshTokenAuthStrategy))
  @Mutation(() => String)
  async refreshToken(@AuthorizedUser() user: User): Promise<string> {
    return this.commandBus.execute(new SignAccessTokenCommand(user));
  }

  /**
   * Sign In
   *
   * @param input
   * @returns
   */
  @Mutation(() => String)
  async signIn(
    @Context() { req }: IGqlContext,
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

    this.cookie.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

    return accessToken;
  }

  /**
   * Sign Up
   *
   * @param input
   * @returns
   */
  @Mutation(() => String)
  async signUp(
    @Context() { req }: IGqlContext,
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

    this.cookie.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

    return accessToken;
  }

  /**
   * Request for oauth sign-in (or sign-up).
   *
   * @param input
   * @returns
   */
  @Mutation(() => String)
  async requestOAuth(@Args('input') input: RequestOauthInput): Promise<string> {
    return this.commandBus.execute(new RequestOauthCommand(input));
  }

  /**
   * Authorize oauth response.
   *
   * @param input
   * @returns
   */
  @Mutation(() => String)
  async authorizeOAuth(
    @Context() { req }: IGqlContext,
    @Args('input') input: AuthorizeOauthInput,
  ): Promise<string> {
    const [user, accessToken] = await this.commandBus.execute(
      new AuthorizeOauthCommand(input),
    );

    // Register refresh token
    const refreshToken = await this.commandBus.execute(
      new RegisterRefreshTokenCommand(
        user,
        req.clientIp,
        req.headers['user-agent'],
      ),
    );

    this.cookie.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

    return accessToken;
  }
}
