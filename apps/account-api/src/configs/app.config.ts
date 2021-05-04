/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      port: process.env.ACCOUNT_API_PORT,
      origin: process.env.ACCOUNT_API_ORIGIN || false,
      settings: {
        emailVerificationUrl: process.env.ACCOUNT_API_EMAIL_VERIFICATION_URL,
      },
    },
  };
}
