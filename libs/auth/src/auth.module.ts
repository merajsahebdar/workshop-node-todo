import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { Policy } from './factories';
import { JwtAuthStrategy, RefreshTokenAuthStrategy } from './strategies';

/**
 * Auth Module
 */
@Module({
  imports: [SharedModule],
  providers: [Policy, JwtAuthStrategy, RefreshTokenAuthStrategy],
  exports: [Policy, JwtAuthStrategy, RefreshTokenAuthStrategy],
})
export class AuthModule {}
