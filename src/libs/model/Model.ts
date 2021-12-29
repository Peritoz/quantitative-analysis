import ModelElement from "@libs/model/ModelElement";
import Relationship from "@libs/model/Relationship";
import Process from "@libs/model/Process";
import Resource from "@libs/model/Resource";
import InternalBehaviour from "@libs/model/InternalBehaviour";
import ExternalBehaviour from "@libs/model/ExternalBehaviour";
import JsonModelInterface from "@libs/model/JsonModelInterface";

export default class Model {
    name: string = "Unknown";
    processes: Array<Process> = [];
    elements: Array<ModelElement> = [];
    relationships: Array<Relationship> = [];

    constructor(data: Partial<Model> = {}) {
        Object.assign(this, data);
    }

    getName() {
        return this.name;
    }

    getNode(nodeName: string) {
        return this.elements.find(e => e.getName() === nodeName.toUpperCase());
    }

    getElements() {
        return this.elements;
    }

    getAllByType(typeConstructor: any) {
        return this.getElements().filter(e => e instanceof typeConstructor);
    }

    getOutRelationships(node: ModelElement) {
        return this.relationships.filter(r => r.getSource().getName() === node.getName());
    }

    getInRelationships(node: ModelElement) {
        return this.relationships.filter(r => r.getTarget().getName() === node.getName());
    }

    createRelationship(sourceName: string, targetName: string, cardinality: number) {
        const source = this.elements.find(e => e.getName() === sourceName.toUpperCase());
        const target = this.elements.find(e => e.getName() === targetName.toUpperCase());

        if (source) {
            if (target) {
                const relationshipObject = new Relationship({
                    source,
                    target,
                    cardinality
                });

                this.relationships.push(relationshipObject);
            } else {
                console.warn(`Orphan relationship. Target "${targetName}" not found`);
            }
        } else {
            console.warn(`Orphan relationship. Source "${sourceName}" not found`);
        }
    }

    createProcess(name: string, frequencyPeriod: string, requestFrequency: number) {
        const elementObject = new Process({name, frequencyPeriod, requestFrequency});

        this.elements.push(elementObject);
        this.processes.push(elementObject);
    }

    createResource(name: string, capacity: number) {
        const elementObject = new Resource({name, capacity});
        this.elements.push(elementObject);
    }

    createInternalBehaviour(name: string, serviceTime: number) {
        const elementObject = new InternalBehaviour({name, serviceTime});
        this.elements.push(elementObject);
    }

    createExternalBehaviour(name: string) {
        const elementObject = new ExternalBehaviour({name});
        this.elements.push(elementObject);
    }

    setProcessRequestFrequency(processName: string, requestFrequency: number) {
        const process = this.processes.find(p => p.getName() === processName.toUpperCase());

        if (process) {
            process.setRequestFrequency(requestFrequency);
        } else {
            throw new Error(`Process "${processName}" not found. Unable to set request frequency`);
        }
    }

    setServiceTime(internalBehaviourName: string, serviceTime: number) {
        const internalBehaviour = this.elements.find(e => e.getName() === internalBehaviourName.toUpperCase());

        if (internalBehaviour && internalBehaviour instanceof InternalBehaviour) {
            (internalBehaviour as InternalBehaviour).setServiceTime(serviceTime);
        } else {
            throw new Error(`Internal behaviour "${internalBehaviourName}" not found. Unable to set service time`);
        }
    }

    setResourceCapacity(resourceName: string, capacity: number) {
        const resource = this.elements.find(e => e.getName() === resourceName.toUpperCase());

        if (resource && resource instanceof Resource) {
            (resource as Resource).setCapacity(capacity);
        } else {
            throw new Error(`Resource "${resourceName}" not found. Unable to set capacity`);
        }
    }

    fromJSON(modelInput: Partial<JsonModelInterface>) {
        if (modelInput.name && modelInput.elements && Array.isArray(modelInput.elements) &&
            modelInput.relationships && Array.isArray(modelInput.relationships)) {
            const {name, elements, relationships} = modelInput;

            this.name = name;

            for (let i = 0; i < elements.length; i++) {
                const {name, frequencyPeriod, requestFrequency, capacity, serviceTime, type} = elements[i];

                switch (type) {
                    case "process":
                        this.createProcess(name, frequencyPeriod, requestFrequency);
                        break;
                    case "resource":
                        this.createResource(name, capacity);
                        break;
                    case "internal_behaviour":
                        this.createInternalBehaviour(name, serviceTime);
                        break;
                    case "external_behaviour":
                        this.createExternalBehaviour(name);
                        break;
                }
            }

            for (let i = 0; i < relationships.length; i++) {
                const {source, target, cardinality} = relationships[i];

                this.createRelationship(source, target, cardinality);
            }
        } else {
            throw new Error("Invalid model input");
        }
    }
}