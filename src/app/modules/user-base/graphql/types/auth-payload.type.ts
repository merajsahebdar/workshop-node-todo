import { Field, ObjectType } from '@nestjs/graphql';
import { IAuthPayloadType } from '../../interfaces/auth-payload.type';
import { UserType } from './user.type';

/**
 * Auth Payload
 */
@ObjectType('AuthPayload')
export class AuthPayloadType implements IAuthPayloadType {
  @Field()
  token: string;

  @Field(() => UserType)
  user: UserType;
}
