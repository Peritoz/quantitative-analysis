import ModelElement from "@libs/model/model_element";

export default class Relationship {
    source: ModelElement;
    target: ModelElement;
    cardinality: number;

    constructor(data: { source: ModelElement, target: ModelElement, cardinality?: number }) {
        this.source = data.source;
        this.target = data.target;

        if (data.cardinality !== undefined && data.cardinality > 0) {
            this.cardinality = data.cardinality;
        } else {
            this.cardinality = 1;
        }
    }

    getSource(): ModelElement {
        return this.source;
    }

    getTarget(): ModelElement {
        return this.target;
    }

    getCardinality(): number {
        return this.cardinality;
    }

    setCardinality(cardinality: number): void {
        if (cardinality > 0) {
            this.cardinality = cardinality;
        } else {
            throw new Error(`Relationship cardinality should be greater than 0`);
        }
    }
}