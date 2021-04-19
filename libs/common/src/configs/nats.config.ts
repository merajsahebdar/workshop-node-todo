/**
 * NATS Config
 */
export function natsConfig() {
  return {
    nats: {
      url: process.env.NATS_URL,
    },
  };
}
