const Process = require("../model/Process");
const ExternalBehaviour = require("../model/ExternalBehaviour");
const WorkloadEngine = require("./WorkloadEngine");
const Resource = require("../model/Resource");
const InternalBehaviour = require("../model/InternalBehaviour");

function getLocalFrequency(node) {
    if (node instanceof Process) {
        return node.getRequestFrequency();
    } else {
        return 0;
    }
}

class PerformanceEngine {
    constructor({model}) {
        this.model = model;
    }

    getResourceUtilization(resource) {
        if (resource instanceof Resource) {
            const capacity = resource.getCapacity();
            const relationships = this.model.getOutRelationships(resource);
            let utilization = 0;

            const workloadEngine = new WorkloadEngine({model: this.model});

            for (let i = 0; i < relationships.length; i++) {
                const relationship = relationships[i];
                const behaviour = relationship.getTarget();
                const workload = workloadEngine.getWorkload(behaviour);
                const processingTime = this.getProcessingTime(behaviour);

                utilization += workload * processingTime;
            }

            return utilization / capacity;
        } else {
            throw new Error(`Utilization can be only be calculated for resources. Invalid resource "${resource.getName()}"`);
        }
    }

    getProcessingTime(behaviour) {
        let processingTime = behaviour.getServiceTime();
        let relationships = this.model.getInRelationships(behaviour);

        relationships = relationships.filter(r => !(r.getSource() instanceof Resource));

        for (let i = 0; i < relationships.length; i++) {
            const relationship = relationships[i];
            const cardinality = relationship.getCardinality();
            const element = relationship.getSource();
            const responseTime = this.getResponseTime(element);

            processingTime += cardinality * responseTime;
        }

        return processingTime;
    }

    getResponseTime(behaviour) {
        const relationships = this.model.getInRelationships(behaviour);
        let responseTime = 0;

        if (behaviour instanceof InternalBehaviour) {
            const resources = relationships.filter(r => r.getSource() instanceof Resource);
            const resource = resources.length === 1 ? resources[0].getSource() : null;

            if (resource) {
                responseTime = this.getProcessingTime(behaviour) / (1 - this.getResourceUtilization(resource));
            } else {
                throw new Error(`No resource found: "${behaviour.getName()}"`);
            }
        } else {
            const internalBehaviours = relationships.filter(r => r.getSource() instanceof InternalBehaviour);
            const internalBehaviour = internalBehaviours.length === 1 ? internalBehaviours[0].getSource() : null;

            responseTime = this.getResponseTime(internalBehaviour);
        }

        return responseTime;
    }

    getAllPerformanceMetrics() {
        const internalBehaviours = this.model.getAllByType(InternalBehaviour);
        let result = [];

        for (let i = 0; i < internalBehaviours.length; i++) {
            const behaviour = internalBehaviours[i];
            const inRelationships = this.model.getInRelationships(behaviour);
            const resources = inRelationships.filter(r => r.getSource() instanceof Resource);
            const resource = resources.length === 1 ? resources[0].getSource() : null;
            const outRelationships = this.model.getOutRelationships(behaviour);
            const externalBehaviour = outRelationships.length === 1 ? outRelationships[0].getTarget() : null;

            const responseTime = this.getResponseTime(behaviour);
            const processingTime = this.getProcessingTime(behaviour);
            const resourceUtilization = this.getResourceUtilization(resource);

            result.push({
                resource: resource.getName(),
                internalBehaviour: behaviour.getName(),
                externalBehaviour: externalBehaviour.getName(),
                processingTime,
                responseTime,
                resourceUtilization
            });
        }

        return result;
    }
}

module.exports = PerformanceEngine;