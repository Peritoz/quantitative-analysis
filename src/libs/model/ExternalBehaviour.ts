import ModelElement from "@libs/model/ModelElement";

export default class ExternalBehaviour extends ModelElement {
    constructor(data: { name: string }) {
        super(data.name);
    }
}