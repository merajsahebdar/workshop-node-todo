import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

/**
 * Users Repository
 */
export type UsersRepository = Repository<UserEntity>;
