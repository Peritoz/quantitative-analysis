const ModelElement = require("./ModelElement");

class InternalBehaviour extends ModelElement {
    constructor({name, serviceTime}) {
        super({name});
        this.serviceTime = serviceTime;
    }

    getServiceTime() {
        return this.serviceTime;
    }

    setServiceTime(serviceTime) {
        this.serviceTime = serviceTime;
    }
}

module.exports = InternalBehaviour;