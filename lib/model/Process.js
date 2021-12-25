class Process {
    constructor({name, frequencyPeriod, requestFrequency}) {
        this.name = name.toUpperCase();
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

    getName() {
        return this.name;
    }

    getRequestFrequency() {
        return this.requestFrequency;
    }
}

module.exports = Process;