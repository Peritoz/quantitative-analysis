import ModelElement from "@libs/model/model_element";
import FrequencyMeasure from "@libs/model/frequency_measure";
import {TemporalUnit} from "@libs/model/enums/temporal_unit_enum";

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