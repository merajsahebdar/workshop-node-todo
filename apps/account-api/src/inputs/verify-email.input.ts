import { Field, InputType } from '@nestjs/graphql';
import { IVerifyEmailInput } from '../interfaces';

/**
 * Verify User Input
 */
@InputType()
export class VerifyEmailInput implements IVerifyEmailInput {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field()
  expires: number;

  @Field()
  signature: string;
}
