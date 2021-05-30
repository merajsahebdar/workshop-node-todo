import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Profile } from '@prisma/client';
import { AppInputError, DatabaseService } from '../../common';
import { GetUserProfileQuery } from '../queries';

/**
 * Get User Profile Query Handler
 */
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler
  implements IQueryHandler<GetUserProfileQuery> {
  /**
   * Constructor
   *
   * @param db
   */
  constructor(private db: DatabaseService) {}

  /**
   * Execute
   *
   * @param query
   * @returns
   */
  async execute({ userId }: GetUserProfileQuery): Promise<Profile> {
    const profile = await this.db.profile.findFirst({
      where: {
        userId,
      },
    });

    if (profile) {
      return profile;
    }

    throw new AppInputError(`No Profile found belongs to user: '${userId}'.`);
  }
}
