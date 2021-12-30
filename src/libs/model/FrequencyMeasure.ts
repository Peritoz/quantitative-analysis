import {TemporalUnit} from "@libs/model/enums/TemporalUnitEnum";

export default class FrequencyMeasure {
    value: number;

    constructor(value: number, measurementPeriod: TemporalUnit) {
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
    }

    getValue() {
        return this.value;
    }

    setValue(value: number) {
        this.value = value;
    }
}