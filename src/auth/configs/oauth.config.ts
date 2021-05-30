/**
 * OAuth Config
 */
export function oauthConfig() {
  return {
    oauth: {
      google: {
        clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URI,
      },
      github: {
        clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        redirectUri: process.env.OAUTH_GITHUB_REDIRECT_URI,
      },
      facebook: {
        clientId: process.env.OAUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.OAUTH_FACEBOOK_CLIENT_SECRET,
        redirectUri: process.env.OAUTH_FACEBOOK_REDIRECT_URI,
      },
    },
  };
}
