/**
 * Normalizes an array of numbers to the range [0,1]. This function updates the input array.
 * @param distribution Array of numbers to be normalized
 * @param getter Custom function to get the value to be normalized from an element
 * @param setter Custom function to set the normalized value in the element
 */
export function normalizeDistribution<T extends { [key: string]: any }>(
  distribution: Array<T>,
  getter: (element: T) => number,
  setter: (element: T, value: number) => void,
): void {
  const values: Array<number> = distribution.map(e => getter(e));
  const min = Math.min(...values);
  const valuesSubtractedByMin = values.map(n => n - min);
  const max = Math.max(...valuesSubtractedByMin);

  for (let i = 0; i < distribution.length; i++) {
    const element = distribution[i];
    const normalizedValue = valuesSubtractedByMin[i] / max;

    setter(element, normalizedValue);
  }
}
