export function fillArrayWithEmptyStrings(
  num: number,
  arr: string[]
): string[] {
  if (arr.length >= num) {
    return arr;
  }

  const diff = num - arr.length;
  const emptyStrings = new Array(diff).fill("");

  return [...arr, ...emptyStrings];
}
