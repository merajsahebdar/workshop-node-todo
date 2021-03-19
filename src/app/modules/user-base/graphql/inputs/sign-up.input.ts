import { Field, InputType } from '@nestjs/graphql';
import { ISignUpInput } from '../../interfaces/sign-up.input';

/**
 * Sign Up Input
 */
@InputType()
export class SignUpInput implements ISignUpInput {
  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
