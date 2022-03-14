import ModelElement from "@libs/model/model_element";
import TemporalMeasure from "@libs/model/temporal_measure";
import {TemporalUnit} from "@libs/model/enums/temporal_unit_enum";

export default class InternalBehaviour extends ModelElement {
    serviceTime: TemporalMeasure;
    timeUnit: TemporalUnit;

    constructor(data: { name: string, serviceTime: TemporalMeasure, timeUnit?: TemporalUnit }) {
        super(data.name);

        this.timeUnit = data.timeUnit || TemporalUnit.SEC;
        this.serviceTime = data.serviceTime;
    }

    getServiceTime(): number {
        return this.serviceTime.getValue();
    }

    setServiceTime(serviceTime: number): void {
        this.serviceTime.setValue(serviceTime);
    }
}