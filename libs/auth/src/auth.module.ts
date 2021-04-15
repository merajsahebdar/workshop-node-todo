import { Module } from '@nestjs/common';
import { Policy } from './factories';

/**
 * Auth Module
 */
@Module({
  providers: [Policy],
  exports: [Policy],
})
export class AuthModule {}
