import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IAccountType } from '../interfaces';
import { GetUserAccountQuery } from '../queries';
import { AccountService } from '../services';

/**
 * Get User Account Query Handler
 */
@QueryHandler(GetUserAccountQuery)
export class GetUserAccountQueryHandler
  implements IQueryHandler<GetUserAccountQuery> {
  /**
   * Constructor
   *
   * @param {AccountService} accountService
   */
  constructor(private accountService: AccountService) {}

  /**
   * Execute
   *
   * @param {GetUserAccountQuery} query
   */
  async execute({ userId }: GetUserAccountQuery): Promise<IAccountType> {
    return this.accountService.findByUserId(userId);
  }
}
