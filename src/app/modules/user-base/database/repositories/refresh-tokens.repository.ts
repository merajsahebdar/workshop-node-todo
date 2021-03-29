import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

/**
 * Refresh Token Repositoy
 */
export type RefreshTokensRepository = Repository<RefreshTokenEntity>;
