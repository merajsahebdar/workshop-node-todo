import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { MatchWith } from '../../../../../validators/match-with.validator';
import { ISignUpInput } from '../../interfaces/sign-up.input';

/**
 * Sign Up Input
 */
@InputType()
export class SignUpInput implements ISignUpInput {
  @Field()
  @IsEmail(undefined, { message: 'The email address is not valid.' })
  readonly email: string;

  @Field()
  @Length(8, undefined, {
    message: 'The password must contains at least 8 characters.',
  })
  readonly password: string;

  @Field()
  @MatchWith('password', {
    message: 'Provided passwords must match.',
  })
  readonly passwordConfirm: string;
}
