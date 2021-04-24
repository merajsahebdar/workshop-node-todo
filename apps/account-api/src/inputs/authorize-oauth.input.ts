import { OAuthProvider } from '@app/auth';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { IAuthorizeOAuthInput } from '../interfaces';

/**
 * Authorize OAuth Input
 */
@InputType()
export class AuthorizeOAuthInput implements IAuthorizeOAuthInput {
  @Field(() => OAuthProvider)
  @IsEnum(OAuthProvider, { message: 'The oauth provider is not valid.' })
  provider: OAuthProvider;

  @Field()
  code: string;
}
