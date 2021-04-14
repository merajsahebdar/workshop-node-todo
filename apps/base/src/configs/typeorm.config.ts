/**
 * TypeORM Config
 */
export function typeormConfig() {
  return {
    typeorm: {
      host: process.env.TYPEORM_HOST,
      port: process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
    },
  };
}
