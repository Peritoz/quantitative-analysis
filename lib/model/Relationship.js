class Relationship {
    constructor({source, target, cardinality}) {
        this.source = source;
        this.target = target;
        this.cardinality = cardinality || 1;
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

module.exports = Relationship;