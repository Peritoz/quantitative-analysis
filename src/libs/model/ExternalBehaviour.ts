import ModelElement from "@libs/model/ModelElement";

export default class ExternalBehaviour extends ModelElement {
    constructor(data: Partial<ModelElement> = {}) {
        super(data.name);
    }
}