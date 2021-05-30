import { User } from '.prisma/client';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AppInputError, DatabaseService } from '../../common';
import { GetUserQuery } from '../queries';

/**
 * Get User Query Handler
 */
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
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
   */
  async execute({ id }: GetUserQuery): Promise<User> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (user) {
      return user;
    }

    throw new AppInputError(`No user found with id: '${id}'.`);
  }
}
