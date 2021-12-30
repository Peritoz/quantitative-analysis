import Resource from "@libs/model/Resource";
import InternalBehaviour from "@libs/model/InternalBehaviour";
import Model from "@libs/model/Model";
import WorkloadEngine from "@libs/engines/WorkloadEngine";
import PerformanceMetricInterface from "@libs/engines/PerformanceMetricInterface";

export default class PerformanceEngine {
    model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    getResourceUtilization(resource: Resource) {
        const capacity = resource.getCapacity();
        const relationships = this.model.getOutRelationships(resource);
        let utilization = 0;

        const workloadEngine = new WorkloadEngine(this.model);

        for (let i = 0; i < relationships.length; i++) {
            const relationship = relationships[i];
            const behaviour = relationship.getTarget();
            const workload = workloadEngine.getWorkload(behaviour);
            const processingTime = behaviour instanceof InternalBehaviour ? this.getProcessingTime(behaviour as InternalBehaviour) : 0;

            utilization += workload * processingTime;
        }

        return utilization / capacity;
    }

    getProcessingTime(behaviour: InternalBehaviour) {
        let processingTime = behaviour.getServiceTime();
        let relationships = this.model.getInRelationships(behaviour);

        relationships = relationships.filter(r => !(r.getSource() instanceof Resource));

        for (let i = 0; i < relationships.length; i++) {
            const relationship = relationships[i];
            const cardinality = relationship.getCardinality();
            const element = relationship.getSource();
            const responseTime = element instanceof InternalBehaviour ? this.getResponseTime(element as InternalBehaviour) : 0;

            processingTime += cardinality * responseTime;
        }

        return processingTime;
    }

    getResponseTime(behaviour: InternalBehaviour) {
        const relationships = this.model.getInRelationships(behaviour);
        let responseTime = 0;

        if (behaviour instanceof InternalBehaviour) {
            const resources = relationships.filter(r => r.getSource() instanceof Resource);
            const resource = resources.length === 1 ? resources[0].getSource() : null;

            if (resource) {
                responseTime = this.getProcessingTime(behaviour) / (1 - this.getResourceUtilization(resource as Resource));
            } else {
                throw new Error(`No resource found: "${behaviour.getName()}"`);
            }
        } else {
            const internalBehaviours = relationships.filter(r => r.getSource() instanceof InternalBehaviour);
            const internalBehaviour = internalBehaviours.length === 1 ? internalBehaviours[0].getSource() : null;

            responseTime = this.getResponseTime(internalBehaviour as InternalBehaviour);
        }

        return responseTime;
    }

    getAllPerformanceMetrics(): Array<Partial<PerformanceMetricInterface>> {
        const internalBehaviours = this.model.getAllByType(InternalBehaviour);
        let result = [];

        for (let i = 0; i < internalBehaviours.length; i++) {
            const behaviour = internalBehaviours[i];
            const inRelationships = this.model.getInRelationships(behaviour);
            const resources = inRelationships.filter(r => r.getSource() instanceof Resource);
            const resource = resources.length === 1 ? resources[0].getSource() : null;
            const outRelationships = this.model.getOutRelationships(behaviour);
            const externalBehaviour = outRelationships.length === 1 ? outRelationships[0].getTarget() : null;

            const responseTime = this.getResponseTime(behaviour as InternalBehaviour);
            const processingTime = this.getProcessingTime(behaviour as InternalBehaviour);
            const resourceUtilization = this.getResourceUtilization(resource as Resource);

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