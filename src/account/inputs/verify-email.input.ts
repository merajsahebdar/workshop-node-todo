import { Field, InputType } from '@nestjs/graphql';
import { VerifyEmailInputInterface } from '../interfaces';

/**
 * Verify User Input
 */
@InputType()
export class VerifyEmailInput implements VerifyEmailInputInterface {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field()
  expires: number;

  @Field()
  signature: string;
}
