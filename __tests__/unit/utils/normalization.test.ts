import { normalizeDistribution } from '@libs/utils/normalization';

describe('Normalization', () => {
  it('should return values in the range [0,1]', () => {
    const distribution = [
      { value: 100 },
      { value: 120 },
      { value: 150 },
      { value: 180 },
      { value: 200 },
    ];
    const expectedResult = [0, 0.2, 0.5, 0.8, 1];

    type Entry = { value: number };

    normalizeDistribution<Entry>(
      distribution,
      (e: Entry) => e.value,
      (e: Entry, v: number) => (e.value = v),
    );

    const result: Array<number> = distribution.map((e: Entry) => e.value);

    expect(result.length).toBe(expectedResult.length);

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(expectedResult[i]);
    }
  });
});
