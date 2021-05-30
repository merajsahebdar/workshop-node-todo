import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, Length, ValidateNested } from 'class-validator';
import { IsUnique, MatchWith } from '../../common';
import {
  SignUpProfileInputInterface,
  SignUpEmailInputInterface,
  SignUpInputInterface,
} from '../interfaces';

/**
 * Sign Up Profile Input
 */
@InputType()
class SignUpProfileInput implements SignUpProfileInputInterface {
  @Field()
  forename: string;

  @Field()
  surname: string;
}

/**
 * Sign Up Email Input
 */
@InputType()
class SignUpEmailInput implements SignUpEmailInputInterface {
  @Field()
  @IsEmail(undefined, { message: 'The email address is not valid.' })
  @IsUnique(
    async (address: string, db) => {
      return (await db.email.count({ where: { address } })) === 0;
    },
    {
      message: 'The provided email address is not available.',
    },
  )
  readonly address: string;
}

/**
 * Sign Up Input
 */
@InputType()
export class SignUpInput implements SignUpInputInterface {
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

  @Field(() => SignUpEmailInput)
  @ValidateNested({ each: true })
  @Type(() => SignUpEmailInput)
  email: SignUpEmailInput;

  @Field(() => SignUpProfileInput)
  @ValidateNested({ each: true })
  @Type(() => SignUpProfileInput)
  profile: SignUpProfileInput;
}
