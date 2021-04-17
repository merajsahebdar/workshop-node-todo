/**
 * Extend Metadata
 *
 * @param {string} key
 * @param {T} metadata
 * @param {Function} target
 */
export function extendMetadata<T extends Array<unknown>>(
  key: string,
  metadata: T,
  target: any,
) {
  const value = [...(Reflect.getMetadata(key, target) || []), ...metadata];
  Reflect.defineMetadata(key, value, target);
}
