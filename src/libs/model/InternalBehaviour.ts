import ModelElement from "@libs/model/ModelElement";

export default class InternalBehaviour extends ModelElement {
    serviceTime: number;

    constructor(data: Partial<InternalBehaviour> = {}) {
        super(data.name);

        this.serviceTime = data.serviceTime !== undefined ? data.serviceTime : 1;
    }

    getServiceTime() {
        return this.serviceTime;
    }

    setServiceTime(serviceTime: number) {
        this.serviceTime = serviceTime;
    }
}