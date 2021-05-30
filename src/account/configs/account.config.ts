/**
 * Account Config
 */
export function accountConfig() {
  return {
    account: {
      emailVerificationUrl: process.env.ACCOUNT_EMAIL_VERIFICATION_URL,
    },
  };
}
