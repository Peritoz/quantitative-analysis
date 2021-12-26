const Process = require("./Process");
const Resource = require("./Resource");
const ExternalBehaviour = require("./ExternalBehaviour");
const InternalBehaviour = require("./InternalBehaviour");
const Relationship = require("./Relationship");

class Model {
    constructor({name}) {
        this.name = name;
        this.processes = [];
        this.elements = [];
        this.relationships = [];
    }

    getName() {
        return this.name;
    }

    getNode(nodeName) {
        return this.elements.find(e => e.getName() === nodeName.toUpperCase());
    }

    getElements() {
        return this.elements;
    }

    getAllByType(typeConstructor) {
        return this.getElements().filter(e => e instanceof typeConstructor);
    }

    getOutRelationships(node) {
        return this.relationships.filter(r => r.getSource().getName() === node.getName());
    }

    getInRelationships(node) {
        return this.relationships.filter(r => r.getTarget().getName() === node.getName());
    }

    createRelationship(sourceName, targetName, cardinality) {
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

    createProcess(name, frequencyPeriod, requestFrequency) {
        const elementObject = new Process({name, frequencyPeriod, requestFrequency});

        this.elements.push(elementObject);
        this.processes.push(elementObject);
    }

    createResource(name, capacity) {
        const elementObject = new Resource({name, capacity});
        this.elements.push(elementObject);
    }

    createInternalBehaviour(name, serviceTime) {
        const elementObject = new InternalBehaviour({name, serviceTime});
        this.elements.push(elementObject);
    }

    createExternalBehaviour(name) {
        const elementObject = new ExternalBehaviour({name});
        this.elements.push(elementObject);
    }

    setProcessRequestFrequency(processName, requestFrequency) {
        const process = this.processes.find(p => p.getName() === processName.toUpperCase());

        if (process) {
            process.setRequestFrequency(requestFrequency);
        }else{
            throw new Error(`Process "${processName}" not found. Unable to set request frequency`);
        }
    }

    setServiceTime(internalBehaviourName, serviceTime) {
        const internalBehaviour = this.elements.find(e => e.getName() === internalBehaviourName.toUpperCase());

        if (internalBehaviour && internalBehaviour instanceof InternalBehaviour) {
            internalBehaviour.setServiceTime(serviceTime);
        }else{
            throw new Error(`Internal behaviour "${internalBehaviourName}" not found. Unable to set service time`);
        }
    }

    setResourceCapacity(resourceName, capacity) {
        const resource = this.elements.find(e => e.getName() === resourceName.toUpperCase());

        if (resource && resource instanceof Resource) {
            resource.setCapacity(capacity);
        }else{
            throw new Error(`Resource "${resourceName}" not found. Unable to set capacity`);
        }
    }

    fromJSON(modelInput) {
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

module.exports = Model;