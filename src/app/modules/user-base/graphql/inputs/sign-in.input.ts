import { Field, InputType } from '@nestjs/graphql';
import { ISignInInput } from '../../typing';

/**
 * Sign In Input
 */
@InputType()
export class SignInInput implements ISignInInput {
  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
