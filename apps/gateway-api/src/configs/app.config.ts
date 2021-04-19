/**
 * App Config
 */
export function appConfig() {
  return {
    app: {
      env: process.env.NODE_ENV,
      port: process.env.GATEWAY_API_PORT,
      origin: process.env.GATEWAY_API_ORIGIN || false,
      serviceList: [
        {
          name: 'account',
          port: process.env.ACCOUNT_API_PORT,
        },
      ],
    },
  };
}
