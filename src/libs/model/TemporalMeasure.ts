import {TemporalUnit} from "@libs/model/enums/TemporalUnitEnum";

export default class TemporalMeasure {
    value: number;

    constructor(value: number, unit: TemporalUnit) {
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
    }

    getValue() {
        return this.value;
    }

    setValue(value: number) {
        this.value = value;
    }

    static stringToUnit(unit: string) {
        if(unit !== undefined){
            switch (unit.toLowerCase()) {
                case "sec":
                    return TemporalUnit.SEC;
                case "min":
                    return TemporalUnit.MIN;
                case "hour":
                    return TemporalUnit.HOUR;
            }
        }

        return TemporalUnit.SEC;
    }
}