import ModelElement from "@libs/model/ModelElement";

export default class Process extends ModelElement {
    frequencyPeriod: string;
    requestFrequency: number;

    constructor(data: Partial<Process> = {}) {
        super(data.name);
        this.frequencyPeriod = data.frequencyPeriod || "sec";
        this.requestFrequency = data.requestFrequency || 100;

        switch (this.frequencyPeriod) {
            case "sec":
                this.requestFrequency = data.requestFrequency;
                break;
            case "min":
                this.requestFrequency = data.requestFrequency / 60;
                break;
            case "hour":
                this.requestFrequency = data.requestFrequency / 3600;
                break;
            case "day":
                this.requestFrequency = data.requestFrequency / 86_400;
                break;
            default:
                this.requestFrequency = data.requestFrequency;
        }
    }

    getRequestFrequency() {
        return this.requestFrequency;
    }

    setRequestFrequency(requestFrequency: number) {
        this.requestFrequency = requestFrequency;
    }
}