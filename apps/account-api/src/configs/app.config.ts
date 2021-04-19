/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      port: process.env.ACCOUNT_API_PORT,
      origin: process.env.ACCOUNT_API_ORIGIN || false,
      setting: {
        userVerificationURL: process.env.ACCOUNT_API_USER_VERIFICATION_URL,
      },
    },
  };
}
