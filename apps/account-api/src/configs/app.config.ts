/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      port: process.env.ACCOUNT_API_PORT,
      settings: {
        emailVerificationUrl: process.env.ACCOUNT_API_EMAIL_VERIFICATION_URL,
      },
    },
  };
}
