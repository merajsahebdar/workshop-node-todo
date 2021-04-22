import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities';

/**
 * Refresh Token Repositoy
 */
export type RefreshTokensRepository = Repository<RefreshTokenEntity>;
