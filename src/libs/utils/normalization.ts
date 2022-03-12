export function normalizeDistribution(distribution: Array<number>): Array<number> {
    const normalizedArray: Array<number> = [];
    const min = Math.min(...distribution);
    const max = Math.max(...distribution);

    for (let i = 0; i < distribution.length; i++) {
        const value = distribution[i];

        normalizedArray.push(normalizeValue(value, min, max));
    }

    return normalizedArray;
}

export function normalizeValue(value: number, min: number, max: number): number {
    return (value - min) / max;
}