/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      env: process.env.NODE_ENV,
      port: process.env.APP_PORT,
      key: process.env.APP_KEY,
    },
  };
}
