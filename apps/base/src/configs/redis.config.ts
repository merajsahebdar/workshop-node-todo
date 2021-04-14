/**
 * Redis Config
 */
export function redisConfig() {
  return {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    queue: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  };
}
