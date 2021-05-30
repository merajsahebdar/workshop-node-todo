import { Field, InputType } from '@nestjs/graphql';
import { OauthAdapterName } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { AuthorizeOauthInputInterface } from '../interfaces';

/**
 * Authorize Oauth Input
 */
@InputType()
export class AuthorizeOauthInput implements AuthorizeOauthInputInterface {
  @Field(() => OauthAdapterName)
  @IsEnum(OauthAdapterName, { message: 'The oauth adapter is not valid.' })
  adapterName: OauthAdapterName;

  @Field()
  code: string;
}
