import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { AppInputError } from 'src/errors/app-input.error';
import { EntityNotFoundError } from 'typeorm';
import { SignInCommand } from '../../logic/commands/sign-in.command';
import { SignUpCommand } from '../../logic/commands/sign-up.command';
import { SignInInput } from '../inputs/sign-in.input';
import { SignUpInput } from '../inputs/sign-up.input';
import { AuthPayloadType } from '../types/auth-payload.type';

/**
 * Auth Resolver
 */
@Resolver()
export class AuthResolver {
  /**
   * Constructor
   */
  constructor(private commandBus: CommandBus) {}

  /**
   * Sign In
   *
   * @param {SignInInput} input
   * @returns
   */
  @Mutation(() => AuthPayloadType)
  async signIn(@Args('input') input: SignInInput): Promise<AuthPayloadType> {
    try {
      return await this.commandBus.execute(new SignInCommand(input));
    } catch (error) {
      if (
        error instanceof AppInputError ||
        error instanceof EntityNotFoundError
      ) {
        throw new UserInputError(
          'The provided email (or password) is not correct.',
        );
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
  @Mutation(() => AuthPayloadType)
  async signUp(@Args('input') input: SignUpInput): Promise<AuthPayloadType> {
    try {
      return await this.commandBus.execute(new SignUpCommand(input));
    } catch (error) {
      if (error instanceof AppInputError) {
        throw new UserInputError(
          'The provided email address is already in use.',
        );
      } else {
        throw error;
      }
    }
  }
}
