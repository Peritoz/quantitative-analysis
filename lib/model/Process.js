const ModelElement = require("./ModelElement");

class Process extends ModelElement {
    constructor({name, frequencyPeriod, requestFrequency}) {
        super({name});
        this.frequencyPeriod = frequencyPeriod;
        this.requestFrequency = 0;

        switch (this.frequencyPeriod) {
            case "sec":
                this.requestFrequency = requestFrequency;
                break;
            case "min":
                this.requestFrequency = requestFrequency / 60;
                break;
            case "hour":
                this.requestFrequency = requestFrequency / 3600;
                break;
            case "day":
                this.requestFrequency = requestFrequency / 86_400;
                break;
            default:
                this.requestFrequency = requestFrequency;
        }
    }

    getRequestFrequency() {
        return this.requestFrequency;
    }
}

module.exports = Process;