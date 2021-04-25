import { IsUnique, MatchWith } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmail, Length, ValidateNested } from 'class-validator';
import { EmailEntity } from '../entities';
import {
  ISignUpAccountInput,
  ISignUpEmailInput,
  ISignUpInput,
} from '../interfaces';

/**
 * Sign Up Account Type
 */
@InputType()
class SignUpAccountInput implements ISignUpAccountInput {
  @Field()
  forename: string;

  @Field()
  surname: string;
}

/**
 * Sign Up Email Input Type
 */
@InputType()
class SignUpEmailInput implements ISignUpEmailInput {
  @Field()
  @IsEmail(undefined, { message: 'The email address is not valid.' })
  @IsUnique([EmailEntity, 'address'], {
    message: 'The email address is not available.',
  })
  readonly address: string;
}

/**
 * Sign Up Input
 */
@InputType()
export class SignUpInput implements ISignUpInput {
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

  @Field(() => SignUpAccountInput)
  @ValidateNested({ each: true })
  @Type(() => SignUpAccountInput)
  account: SignUpAccountInput;
}
