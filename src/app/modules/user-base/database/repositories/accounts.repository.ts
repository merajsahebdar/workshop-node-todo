import { Repository } from 'typeorm';
import { AccountEntity } from '../entities';

/**
 * Account Repository
 */
export type AccountsRepository = Repository<AccountEntity>;
