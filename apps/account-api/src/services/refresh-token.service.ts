import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { RefreshTokenEntity } from '../entities';
import { RefreshTokensRepository } from '../repositories';

/**
 * Refresh Token Service
 */
export class RefreshTokenService {
  /**
   * Refresh Tokens
   */
  @InjectRepository(RefreshTokenEntity)
  private refreshTokens: RefreshTokensRepository;

  /**
   * Create Refresh Token
   *
   * @param {DeepPartial<RefreshTokenEntity>} entityLike
   * @returns
   */
  async createRefreshToken(
    entityLike: DeepPartial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokens.save(this.refreshTokens.create(entityLike));
  }
}
