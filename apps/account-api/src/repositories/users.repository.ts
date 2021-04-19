import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

/**
 * Users Repository
 */
export type UsersRepository = Repository<UserEntity>;
