class ModelElement {
    constructor({name}) {
        this.name = name.toUpperCase();
    }

    getName() {
        return this.name;
    }
}

module.exports = ModelElement;