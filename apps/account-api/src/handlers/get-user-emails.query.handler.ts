import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IEmailType } from '../interfaces';
import { GetUserEmailsQuery } from '../queries';
import { EmailService } from '../services';

/**
 * Get User Emails Query Handler
 */
@QueryHandler(GetUserEmailsQuery)
export class GetUserEmailsQueryHandler
  implements IQueryHandler<GetUserEmailsQuery> {
  /**
   * Constructor
   *
   * @param {EmailService} emailService
   */
  constructor(private emailService: EmailService) {}

  /**
   * Execute
   *
   * @param {GetUserEmailsQuery} query
   */
  async execute({ userId }: GetUserEmailsQuery): Promise<IEmailType[]> {
    return this.emailService.findManyByUserId(userId);
  }
}
