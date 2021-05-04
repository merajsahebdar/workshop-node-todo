import { CommonModule } from '@app/common';
import { Module } from '@nestjs/common';
import { OauthAdapterName } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';
import {
  FaceboookOauthAdapter,
  GitHubOauthAdapter,
  GoogleOauthAdapter,
} from './oauth-adapters';
import { OauthService } from './services';

// Register OauthAdapterName for GraphQL
registerEnumType(OauthAdapterName, { name: 'OauthAdapterName' });

/**
 * OAuth Module
 */
@Module({
  imports: [
    // App Module
    CommonModule,
  ],
  providers: [
    // Oauth Adapters
    FaceboookOauthAdapter,
    GitHubOauthAdapter,
    GoogleOauthAdapter,
    // Services
    OauthService,
  ],
  exports: [OauthService],
})
export class OAuthModule {}
