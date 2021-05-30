/**
 * Common Config
 */
export function commonConfig() {
  return {
    common: {
      env: process.env.NODE_ENV,
      port: process.env.APP_PORT,
      key: process.env.APP_KEY,
      signedRequestExpires: parseInt(
        process.env.APP_SIGNED_REQUEST_EXPIRES as string,
        10,
      ),
    },
  };
}
