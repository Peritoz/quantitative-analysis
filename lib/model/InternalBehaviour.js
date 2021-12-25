class InternalBehaviour {
    constructor({name, serviceTime}) {
        this.name = name.toUpperCase();
        this.serviceTime = serviceTime;
    }

    getName() {
        return this.name;
    }

    getServiceTime() {
        return this.serviceTime;
    }
}

module.exports = InternalBehaviour;