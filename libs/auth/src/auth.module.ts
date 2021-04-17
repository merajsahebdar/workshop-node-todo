import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newEnforcer, newModel } from 'casbin';
import { RbacCasbinAdapter } from './casbin-adapters';
import { RBAC_ENFORCER } from './contants';
import { CasbinRbacPolicyEntity } from './entities';
import {
  RbacStrategy,
  JwtAuthStrategy,
  RefreshTokenAuthStrategy,
} from './strategies';

/**
 * Auth Module
 */
@Module({
  imports: [
    // Third-party Modules
    TypeOrmModule.forFeature([CasbinRbacPolicyEntity]),
    // App Modules
    SharedModule,
  ],
  providers: [
    JwtAuthStrategy,
    RefreshTokenAuthStrategy,
    RbacStrategy,
    RbacCasbinAdapter,
    {
      inject: [RbacCasbinAdapter],
      provide: RBAC_ENFORCER,
      useFactory: async (adapter: RbacCasbinAdapter) => {
        const model = newModel();
        model.addDef('p', 'p', 'sub, feat, act');
        model.addDef('r', 'r', 'sub, feat, act');
        model.addDef('e', 'e', 'some(where (p.eft == allow))');
        model.addDef('g', 'g', '_, _');
        model.addDef(
          'm',
          'm',
          "g(r.sub, p.sub) && r.feat == p.feat && (r.act == p.act || p.act == '*')",
        );

        return newEnforcer(model, adapter);
      },
    },
  ],
  exports: [JwtAuthStrategy, RefreshTokenAuthStrategy, RbacStrategy],
})
export class AuthModule {}
