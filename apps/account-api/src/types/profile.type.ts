import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { GraphProfileInterface } from '../interfaces';

/**
 * Graph Profile
 */
@ObjectType('Profile')
@Directive('@key(fields: "id")')
export class GraphProfile implements GraphProfileInterface {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  forename?: string;

  @Field({ nullable: true })
  surname?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: string;

  @Field(() => GraphQLISODateTime)
  updatedAt: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deletedAt?: string;
}
