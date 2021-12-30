export default class ModelElement {
    name: string = "Unknown";

    constructor(name: string) {
        this.name = name.toUpperCase();
    }

    getName() {
        return this.name;
    }
}