import { Field, InputType } from '@nestjs/graphql';
import { OauthAdapterName } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { RequestOauthInputInterface } from '../interfaces';

/**
 * Request Oauth Input
 */
@InputType()
export class RequestOauthInput implements RequestOauthInputInterface {
  @Field(() => OauthAdapterName)
  @IsEnum(OauthAdapterName, { message: 'The oauth provider is not valid.' })
  adapterName: OauthAdapterName;
}
