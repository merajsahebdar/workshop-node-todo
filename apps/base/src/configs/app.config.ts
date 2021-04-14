/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      env: process.env.NODE_ENV,
      key: process.env.APP_KEY,
      userVerificationURL: process.env.APP_USER_VERIFICATION_URL,
      signedRequestExpires: parseInt(
        process.env.APP_SIGNED_REQUEST_EXPIRES as string,
        10,
      ),
      port: process.env.APP_BASE_PORT,
      origin: process.env.APP_BASE_ORIGIN || false,
    },
  };
}
