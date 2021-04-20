import { AuthModule } from '@app/auth/auth.module';
import { Module } from '@nestjs/common';
import { CreateCasbinPoliciesCommandHandler } from './handlers';
import { CasbinPoliciesService } from './services';

/**
 * Casbin Management Module
 */
@Module({
  imports: [
    // App Modules
    AuthModule,
  ],
  providers: [
    // Services
    CasbinPoliciesService,
    // Handlers
    CreateCasbinPoliciesCommandHandler,
  ],
})
export class CasbinManagementModule {}
