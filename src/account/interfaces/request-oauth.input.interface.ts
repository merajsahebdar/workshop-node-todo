import { OauthAdapterName } from '@prisma/client';

/**
 * Request Oauth Input Interface
 */
export interface RequestOauthInputInterface {
  adapterName: OauthAdapterName;
}
