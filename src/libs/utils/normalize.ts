export function normalize(distribution: Array<number>): Array<number> {
    const normalizedArray: Array<number> = [];
    const min = Math.min(...distribution);
    const max = Math.max(...distribution);

    for (let i = 0; i < distribution.length; i++) {
        const value = distribution[i];

        normalizedArray.push((value - min) / max);
    }

    return normalizedArray;
}