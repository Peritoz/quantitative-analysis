import {TemporalUnit} from "@libs/model/enums/temporal_unit_enum";

export default class FrequencyMeasure {
    value: number;

    constructor(value: number, measurementPeriod?: TemporalUnit) {
        if (value > 0) {
            switch (measurementPeriod) {
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
            throw new Error(`Frequency measure must be greater than 0`);
        }
    }

    getValue(): number {
        return this.value;
    }

    setValue(value: number): void {
        if (value > 0) {
            this.value = value;
        } else {
            throw new Error(`Frequency measure must be greater than 0`);
        }
    }
}