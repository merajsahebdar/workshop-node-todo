import { registerEnumType } from '@nestjs/graphql';

/**
 * OAuth Provider
 */
export enum OAuthProvider {
  FACEBOOK = 'FACEBOOK',
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
}

// Register for Schema
registerEnumType(OAuthProvider, { name: 'OAuthProvider' });
