import { CommonModule } from '@app/common';
import { Module } from '@nestjs/common';
import {
  FaceboookOAuthProvider,
  GitHubOAuthProvider,
  GoogleOAuthProvider,
} from './oauth-providers';
import { OAuthService } from './services';

/**
 * OAuth Module
 */
@Module({
  imports: [
    // App Module
    CommonModule,
  ],
  providers: [
    // OAuth Providers
    FaceboookOAuthProvider,
    GoogleOAuthProvider,
    GitHubOAuthProvider,
    // Services
    OAuthService,
  ],
  exports: [OAuthService],
})
export class OAuthModule {}
