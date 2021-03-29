import { UseGuards, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { AppInputError } from '../../../../errors/app-input.error';
import { IAppContext } from '../../../../interfaces/app-context.interface';
import { GqlValidationPipe } from '../../../../pipes/gql-validation.pipe';
import { UserEntity } from '../../database/entities/user.entity';
import { RefreshTokenRegistererCommand } from '../../logic/commands/refresh-token-registerer.command';
import { SignAccessTokenCommand } from '../../logic/commands/sign-access-token.command';
import { SignInCommand } from '../../logic/commands/sign-in.command';
import { SignUpCommand } from '../../logic/commands/sign-up.command';
import { REFRESH_TOKEN_COOKIE_KEY } from '../../logic/contants';
import { AuthorizedUser } from '../../logic/decorators/authorized-user.decorator';
import { RefreshTokenGuard } from '../../logic/guards/refresh-token.guard';
import { CookieService } from '../../logic/services/cookie.service';
import { SignInInput } from '../inputs/sign-in.input';
import { SignUpInput } from '../inputs/sign-up.input';

/**
 * Auth Resolver
 */
@Resolver()
@UsePipes(new GqlValidationPipe())
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
    try {
      return await this.commandBus.execute(new SignAccessTokenCommand(user));
    } catch (error) {
      if (error instanceof AppInputError) {
        throw new UserInputError(error.message);
      } else {
        throw error;
      }
    }
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
    try {
      // Login
      const [user, accessToken] = await this.commandBus.execute(
        new SignInCommand(input),
      );

      // Register refresh token
      const refreshToken = await this.commandBus.execute(
        new RefreshTokenRegistererCommand(
          user,
          req.clientIp,
          req.headers['user-agent'],
        ),
      );

      this.cookieService.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

      return accessToken;
    } catch (error) {
      if (error instanceof AppInputError) {
        throw new UserInputError(error.message);
      } else {
        throw error;
      }
    }
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
    try {
      // Register
      const [user, accessToken] = await this.commandBus.execute(
        new SignUpCommand(input),
      );

      // Register refresh token
      const refreshToken = await this.commandBus.execute(
        new RefreshTokenRegistererCommand(
          user,
          req.clientIp,
          req.headers['user-agent'],
        ),
      );

      this.cookieService.setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken);

      return accessToken;
    } catch (error) {
      if (error instanceof AppInputError) {
        throw new UserInputError(error.message);
      } else {
        throw error;
      }
    }
  }
}
