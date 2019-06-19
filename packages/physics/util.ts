import { Particle } from "particle";

/**
 * Removes elements from an array and, if necessary, inserts new elements in
 * their place, returning the deleted elements.
 *
 * @param arr - The array to splice.
 * @param start — The zero-based location in the array from which to start
 *                removing elements.
 * @param deleteCount — The number of elements to remove.
 */
export function splice(
  arr: Array<Particle>,
  start: number,
  deleteCount?: number | undefined
): Array<Particle>;
export function splice(
  arr: Array<any>,
  start: number,
  deleteCount?: number | undefined
) {
  arr = arr.slice();
  arr.splice(start, deleteCount);
  return arr;
}
