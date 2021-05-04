import { DatabaseService } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Email } from '@prisma/client';
import { GetUserEmailsQuery } from '../queries';

/**
 * Get User Emails Query Handler
 */
@QueryHandler(GetUserEmailsQuery)
export class GetUserEmailsQueryHandler
  implements IQueryHandler<GetUserEmailsQuery> {
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
  async execute({ userId }: GetUserEmailsQuery): Promise<Email[]> {
    return this.db.email.findMany({
      where: {
        userId,
      },
    });
  }
}
