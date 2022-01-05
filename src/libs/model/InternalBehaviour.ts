import ModelElement from "@libs/model/ModelElement";
import TemporalMeasure from "@libs/model/TemporalMeasure";
import {TemporalUnit} from "@libs/model/enums/TemporalUnitEnum";

export default class InternalBehaviour extends ModelElement {
    serviceTime: TemporalMeasure;
    timeUnit: TemporalUnit;

    constructor(data: { name: string, serviceTime: TemporalMeasure, timeUnit?: TemporalUnit }) {
        super(data.name);

        this.timeUnit = data.timeUnit || TemporalUnit.SEC;
        this.serviceTime = data.serviceTime;
    }

    getServiceTime() {
        return this.serviceTime.getValue();
    }

    setServiceTime(serviceTime: number) {
        this.serviceTime.setValue(serviceTime);
    }
}