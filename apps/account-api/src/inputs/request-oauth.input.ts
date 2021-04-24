import { OAuthProvider } from '@app/auth';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { IRequestOAuthInput } from '../interfaces';

/**
 * Request OAuth Input
 */
@InputType()
export class RequestOAuthInput implements IRequestOAuthInput {
  @Field(() => OAuthProvider)
  @IsEnum(OAuthProvider, { message: 'The oauth provider is not valid.' })
  provider: OAuthProvider;
}
