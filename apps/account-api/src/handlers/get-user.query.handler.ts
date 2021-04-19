import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserType } from '../interfaces';
import { GetUserQuery } from '../queries';
import { UserService } from '../services';

/**
 * Get User Query Handler
 */
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  /**
   * Constructor
   *
   * @param {UserService} userService
   */
  constructor(private userService: UserService) {}

  /**
   * Execute
   *
   * @param {GetUserQuery} query
   */
  async execute(query: GetUserQuery): Promise<IUserType> {
    return this.userService.findById(query.id);
  }
}
