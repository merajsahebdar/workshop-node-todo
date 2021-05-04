import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphProfile } from '../types';

/**
 * Profile Resolver
 */
@Resolver(() => GraphProfile)
export class ProfileResolver {
  /**
   * Name
   *
   * @param profile
   * @returns
   */
  @ResolveField()
  name(@Parent() profile: GraphProfile): string | null {
    if (profile.name) {
      return profile.name;
    }

    if (profile.forename && profile.surname) {
      return `${profile.forename} ${profile.surname}`;
    }

    return null;
  }
}
