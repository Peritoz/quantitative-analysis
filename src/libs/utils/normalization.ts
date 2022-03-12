export function normalizeValue(value: number, min: number, max: number): number {
    return (value - min) / max;
}

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
                }else{
                    if(value < mappedRange.min){
                        rangeMap[key].min = value;
                    }

                    if(value > mappedRange.max){
                        rangeMap[key].max = value;
                    }
                }
            }
        }
    }

    return rangeMap;
}