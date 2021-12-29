import Process from "@libs/model/Process";

interface InputElement {
    name: string,
    type: string,
    capacity: number,
    serviceTime: number,
    frequencyPeriod: string,
    requestFrequency: number
}

interface InputRelationship{
    source: string,
    target: string,
    cardinality: number
}

export default interface JsonModelInterface {
    name: string;
    processes: Array<Process>;
    elements: Array<Partial<InputElement>>;
    relationships: Array<InputRelationship>;
}