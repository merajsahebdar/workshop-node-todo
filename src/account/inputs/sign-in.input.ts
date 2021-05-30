import { Field, InputType } from '@nestjs/graphql';
import { SignInEmailInputInterface, SignInInputInterface } from '../interfaces';

/**
 * Sign In Email Input
 */
@InputType()
class SignInEmailInput implements SignInEmailInputInterface {
  @Field()
  readonly address: string;
}

/**
 * Sign In Input
 */
@InputType()
export class SignInInput implements SignInInputInterface {
  @Field()
  readonly email: SignInEmailInput;

  @Field()
  readonly password: string;
}
