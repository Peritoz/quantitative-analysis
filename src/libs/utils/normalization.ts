import QuantitativeMetric from "@libs/model/interfaces/quantitative_metric";

/**
 * Normalizes an array of numbers to the range [0,1]. This function updates the input array.
 * @param distribution Array of numbers to be normalized
 * @param getter Custom function to get the value to be normalized from an element
 * @param setter Custom function to set the normalized value in the element
 */
export function normalizeDistribution<T extends { [key: string]: any }>(
    distribution: Array<T>,
    getter: (element: T) => number,
    setter: (element: T, value: number) => void
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

/**
 * Finds the range for fields of type number of objects
 * @param metrics Array of objects containing fields of mixed types
 * @return Object mapping containing the minimum and maximum values for each key of type number
 */
export function findRanges<T extends { [key: string]: any }>(metrics: Array<T>): { [key: string]: { min: number, max: number } } {
    const rangeMap: { [key: string]: { min: number, max: number } } = {};

    // Getting the minimum and maximum
    for (let i = 0; i < metrics.length; i++) {
        const metric = metrics[i];

        // For each key of type number, set minimum and maximum
        for (const key in metric) {
            if (metric.hasOwnProperty(key) && typeof metric[key] === "number") {
                const value: number = metric[key];
                const mappedRange = rangeMap[key];

                if (mappedRange === undefined) {
                    rangeMap[key] = {min: value, max: value};
                } else {
                    if (value < mappedRange.min) {
                        rangeMap[key].min = value;
                    }

                    if (value > mappedRange.max) {
                        rangeMap[key].max = value;
                    }
                }
            }
        }
    }

    return rangeMap;
}