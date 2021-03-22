import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IUserType } from '../../typing/interfaces/user.type';
import { GetUserQuery } from '../queries/get-user.query';
import { UserService } from '../services/user.service';

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
