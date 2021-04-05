import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAppInputErrorFilter } from '../../../../filters/gql-app-input-error.filter';
import { IAppContext } from '../../../../interfaces';
import { GqlValidationPipe } from '../../../../pipes';
import { UserEntity } from '../../database';
import {
  SignInCommand,
  SignAccessTokenCommand,
  SignUpCommand,
  RegisterRefreshTokenCommand,
  CookieService,
  RefreshTokenGuard,
  AuthorizedUser,
  REFRESH_TOKEN_COOKIE_KEY,
} from '../../logic';
import { SignInInput, SignUpInput } from '../inputs';

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
   * @param {CookieService} cookieService
   * @param {CommandBus} commandBus
   */
  constructor(
    private cookieService: CookieService,
    private commandBus: CommandBus,
  ) {}

  /**
   * Return a new signed access token from given refresh token.
   *
   * @param {UserEntity} user
   * @returns
   */
  @UseGuards(RefreshTokenGuard)
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
}
