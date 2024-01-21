import { TemporalUnit } from '@libs/model/enums/temporal_unit_enum';

export default class TemporalMeasure {
  value: number;

  constructor(value: number, unit?: TemporalUnit) {
    if (value > 0) {
      switch (unit) {
        case TemporalUnit.SEC:
          this.value = value;
          break;
        case TemporalUnit.MIN:
          this.value = value / 60;
          break;
        case TemporalUnit.HOUR:
          this.value = value / 3600;
          break;
        default:
          this.value = value;
      }
    } else {
      throw new Error(`Temporal measure must be greater than 0`);
    }
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    if (value > 0) {
      this.value = value;
    } else {
      throw new Error(`Temporal measure must be greater than 0`);
    }
  }

  static stringToUnit(unit: string): number {
    if (unit !== undefined) {
      switch (unit.toLowerCase()) {
        case 'sec':
          return TemporalUnit.SEC;
        case 'min':
          return TemporalUnit.MIN;
        case 'hour':
          return TemporalUnit.HOUR;
      }
    }

    return TemporalUnit.SEC;
  }
}
