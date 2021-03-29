import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';
import { IsUnique, MatchWith } from '../../../../validators';
import { UserEntity } from '../../database';
import { ISignUpInput } from '../../typing';

/**
 * Sign Up Input
 */
@InputType()
export class SignUpInput implements ISignUpInput {
  @Field()
  @IsEmail(undefined, { message: 'The email address is not valid.' })
  @IsUnique([UserEntity, 'email'], {
    message: 'The email address is not available.',
  })
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
