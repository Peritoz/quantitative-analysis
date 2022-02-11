import Process from "@libs/model/process";

interface InputElement {
    name: string,
    type: string,
    capacity: number,
    serviceTime: number,
    timeUnit: string,
    frequencyPeriod: string,
    requestFrequency: number
}

interface InputRelationship{
    source: string,
    target: string,
    cardinality: number
}

export default interface JsonModel {
    name: string;
    processes: Array<Process>;
    elements: Array<Partial<InputElement>>;
    relationships: Array<InputRelationship>;
}