import ModelElement from "@libs/model/ModelElement";

export default class Relationship {
    source: ModelElement = null;
    target: ModelElement = null;
    cardinality: number = 1;

    constructor(data: Partial<Relationship> = {}) {
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