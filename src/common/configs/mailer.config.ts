/**
 * Mailer Config
 */
export function mailerConfig() {
  return {
    mailer: {
      transport: process.env.MAILER_TRANSPORT,
      defaults: {
        from: process.env.MAILER_DEFAULT_SENDER,
      },
    },
  };
}
