import { filter } from './filter';

// Predicate
type Predicate<T> = (elm: T) => Promise<boolean>;

/**
 * Async Every
 *
 * @param {T[]} arr
 * @param {Predicate<T>} predicate
 */
export async function every<T = any>(arr: T[], predicate: Predicate<T>) {
  return (await filter<T>(arr, predicate)).length === arr.length;
}
