/**
 * OAuth Config
 */
export function oauthConfig() {
  return {
    oauth: {
      google: {
        clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.OAUTH_GOOGLE_CLIENT_REDIRECT_URI,
      },
    },
  };
}
