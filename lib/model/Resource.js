class Resource {
    constructor({name, capacity}) {
        this.name = name.toUpperCase();
        this.capacity = capacity
    }

    getName() {
        return this.name;
    }

    getCapacity() {
        return this.capacity;
    }
}

module.exports = Resource;