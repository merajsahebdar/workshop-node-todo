import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { GraphUserInterface } from '../interfaces';
import { GraphProfile } from './profile.type';
import { GraphEmail } from './email.type';

/**
 * Graph User
 */
@ObjectType('User')
@Directive('@key(fields: "id")')
export class GraphUser implements GraphUserInterface {
  @Field(() => ID)
  id: string;

  @Field(() => [GraphEmail])
  emails: GraphEmail[];

  @Field()
  isActivated: boolean;

  @Field()
  isBlocked: boolean;

  @Field(() => GraphProfile)
  profile: GraphProfile;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deletedAt?: string;
}
