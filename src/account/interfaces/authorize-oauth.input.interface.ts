import { OauthAdapterName } from '@prisma/client';

/**
 * Authorize Oauth Input Interface
 */
export interface AuthorizeOauthInputInterface {
  adapterName: OauthAdapterName;
  code: string;
}
