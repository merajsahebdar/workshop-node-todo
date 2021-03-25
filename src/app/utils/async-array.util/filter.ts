// Predicate
type Predicate<T> = (elm: T) => Promise<boolean>;

/**
 * Async Filter
 *
 * @param {T[]} arr
 * @param {Predicate<T>} predicate
 */
export async function filter<T = any>(arr: T[], predicate: Predicate<T>) {
  return Promise.all(arr.map(predicate)).then((values) =>
    arr.filter((elm, idx) => values[idx]),
  );
}
