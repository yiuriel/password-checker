export function binarySearch(arr: string[], target: string): boolean {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) >>> 1; // Optimización: evita Math.floor()
    if (arr[mid] === target) return true;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}
