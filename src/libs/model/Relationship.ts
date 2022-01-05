import ModelElement from "@libs/model/ModelElement";

export default class Relationship {
    source: ModelElement = new ModelElement("UNKNOWN");
    target: ModelElement = new ModelElement("UNKNOWN");
    cardinality: number = 1;

    constructor(data: { source: ModelElement, target: ModelElement, cardinality?: number }) {
        Object.assign(this, data);
    }

    getSource() {
        return this.source;
    }

    getTarget() {
        return this.target;
    }

    getCardinality() {
        return this.cardinality;
    }
}