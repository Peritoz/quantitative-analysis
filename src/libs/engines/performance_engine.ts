import Resource from "@libs/model/resource";
import InternalBehaviour from "@libs/model/internal_behaviour";
import Model from "@libs/model/model";
import WorkloadEngine from "@libs/engines/workload_engine";
import QuantitativeMetric from "@libs/model/interfaces/quantitative_metric";

export default class PerformanceEngine {
    model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    getResourceUtilization(resource: Resource): number {
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

    getProcessingTime(behaviour: InternalBehaviour): number {
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

    getResponseTime(behaviour: InternalBehaviour): number {
        const relationships = this.model.getInRelationships(behaviour);
        let responseTime = 0;

        const resources = relationships.filter(r => r.getSource() instanceof Resource);
        const resource = resources.length === 1 ? resources[0].getSource() : null;
        if (resource) {
            responseTime = this.getProcessingTime(behaviour) / (1 - this.getResourceUtilization(resource as Resource));
        } else {
            throw new Error(`No resource found: "${behaviour.getName()}"`);
        }

        return responseTime;
    }

    getAllPerformanceMetrics(): Array<QuantitativeMetric> {
        const internalBehaviours = this.model.getAllByType(InternalBehaviour);
        let result: Array<QuantitativeMetric> = [];

        for (let i = 0; i < internalBehaviours.length; i++) {
            const behaviour = internalBehaviours[i];
            const inRelationships = this.model.getInRelationships(behaviour);
            const resources = inRelationships.filter(r => r.getSource() instanceof Resource);
            const resource = resources.length === 1 ? resources[0].getSource() : null;

            if (resource) {
                const outRelationships = this.model.getOutRelationships(behaviour);
                const externalBehaviour = outRelationships.length === 1 ? outRelationships[0].getTarget() : null;

                if (externalBehaviour) {
                    const responseTime = this.getResponseTime(behaviour as InternalBehaviour);
                    const processingTime = this.getProcessingTime(behaviour as InternalBehaviour);
                    const resourceUtilization = this.getResourceUtilization(resource as Resource);

                    result.push({
                        resource: resource.getName(),
                        internalBehaviour: behaviour.getName(),
                        externalBehaviour: externalBehaviour.getName(),
                        processingTime,
                        responseTime,
                        resourceUtilization,
                        workload: 0
                    });
                }
            } else {
                throw new Error(`Model is corrupted for quantitative analysis. Missing Resource`);
            }
        }

        return result;
    }
}