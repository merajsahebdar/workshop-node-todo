/**
 * Env
 *
 * @memberof Utility
 */
function env(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    throw new Error(`The environment variable ${name} not set.`);
  }

  return value;
}

// DEFAULT EXPORT
export default env;
