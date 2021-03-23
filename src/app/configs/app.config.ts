/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      env: process.env.NODE_ENV,
      port: process.env.APP_PORT,
      key: process.env.APP_KEY,
      userVerificationURL: process.env.APP_USER_VERIFICATION_URL,
      signedRequestExpires: parseInt(
        process.env.APP_SIGNED_REQUEST_EXPIRES as string,
        10,
      ),
    },
  };
}
