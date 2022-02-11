import ModelElement from "@libs/model/model_element";

export default class ExternalBehaviour extends ModelElement {
    constructor(data: { name: string }) {
        super(data.name);
    }
}