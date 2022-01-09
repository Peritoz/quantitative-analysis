import ModelElement from "@libs/model/ModelElement";

export default class Relationship {
    source: ModelElement = new ModelElement("UNKNOWN");
    target: ModelElement = new ModelElement("UNKNOWN");
    cardinality: number = 1;

    constructor(data: { source: ModelElement, target: ModelElement, cardinality?: number }) {
        this.source = data.source;
        this.target = data.target;

        if (data.cardinality !== undefined) {
            this.cardinality = data.cardinality;
        }
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