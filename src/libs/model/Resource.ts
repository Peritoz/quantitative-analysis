import ModelElement from "@libs/model/ModelElement";

export default class Resource extends ModelElement {
    capacity: number;

    constructor(data: Partial<Resource> = {}) {
        super(data.name);

        this.capacity = data.capacity !== undefined ? data.capacity : 1;
    }

    getCapacity() {
        return this.capacity;
    }

    setCapacity(capacity: number) {
        this.capacity = capacity;
    }
}