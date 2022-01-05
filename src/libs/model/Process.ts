import ModelElement from "@libs/model/ModelElement";
import FrequencyMeasure from "@libs/model/FrequencyMeasure";
import {TemporalUnit} from "@libs/model/enums/TemporalUnitEnum";

export default class Process extends ModelElement {
    frequencyPeriod: TemporalUnit;
    requestFrequency: FrequencyMeasure;

    constructor(data: { name: string, frequencyPeriod?: TemporalUnit, requestFrequency: FrequencyMeasure }) {
        super(data.name);

        this.frequencyPeriod = data.frequencyPeriod || TemporalUnit.SEC;
        this.requestFrequency = data.requestFrequency;
    }

    getRequestFrequency() {
        return this.requestFrequency.getValue();
    }

    setRequestFrequency(requestFrequency: number) {
        this.requestFrequency.setValue(requestFrequency);
    }
}