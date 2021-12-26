const ModelElement = require("./ModelElement");

class Resource extends ModelElement {
    constructor({name, capacity}) {
        super({name});
        this.capacity = capacity || 1;
    }

    getCapacity() {
        return this.capacity;
    }
}

module.exports = Resource;