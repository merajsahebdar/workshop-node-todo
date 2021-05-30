import { OauthAdapterName } from '@prisma/client';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { newEnforcer, newModel } from 'casbin';
import { RbacCasbinAdapter } from './casbin-adapters';
import { RBAC_ENFORCER } from './contants';
import {
  FaceboookOauthAdapter,
  GitHubOauthAdapter,
  GoogleOauthAdapter,
} from './oauth-adapters';
import { CasbinPoliciesService, OauthService } from './services';
import {
  RbacStrategy,
  JwtAuthStrategy,
  RefreshTokenAuthStrategy,
} from './strategies';
import { CreateCasbinPoliciesCommandHandler } from './handlers';

// Register OauthAdapterName for GraphQL
registerEnumType(OauthAdapterName, { name: 'OauthAdapterName' });

const RbacEnforcerProvider: Provider = {
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
};

/**
 * Auth Module
 */
@Module({
  providers: [
    RbacEnforcerProvider,
    JwtAuthStrategy,
    RefreshTokenAuthStrategy,
    RbacStrategy,
    RbacCasbinAdapter,
    OauthService,
    FaceboookOauthAdapter,
    GitHubOauthAdapter,
    GoogleOauthAdapter,
    CasbinPoliciesService,
    CreateCasbinPoliciesCommandHandler,
  ],
  exports: [
    RbacEnforcerProvider,
    JwtAuthStrategy,
    RefreshTokenAuthStrategy,
    RbacStrategy,
    OauthService,
  ],
})
export class AuthModule {
  /**
   * Register Module Globally
   *
   * @returns
   */
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      global: true,
    };
  }
}
