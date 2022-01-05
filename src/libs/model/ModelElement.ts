export default class ModelElement {
    name: string = "UNKNOWN";

    constructor(name: string) {
        this.name = name.toUpperCase();
    }

    getName() {
        return this.name;
    }
}