import { Module } from '@nestjs/common';
import { HashService, JwtService, SignedParamsService } from './services';

/**
 * Common Module
 */
@Module({
  providers: [JwtService, HashService, SignedParamsService],
  exports: [JwtService, HashService, SignedParamsService],
})
export class CommonModule {}
