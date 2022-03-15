import Process from "@libs/model/process";
import Resource from "@libs/model/resource";
import ExternalBehaviour from "@libs/model/external_behaviour";
import Model from "@libs/model/model";
import ModelElement from "@libs/model/model_element";
import QuantitativeMetric from "@libs/model/interfaces/quantitative_metric";
import InternalBehaviour from "@libs/model/internal_behaviour";

class WorkloadEngine {
    model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    getWorkload(element: ModelElement): number {
        const outRelationships = this.model.getOutRelationships(element);
        let workload = element instanceof Process ? (element as Process).getRequestFrequency() : 0;

        for (let i = 0; i < outRelationships.length; i++) {
            const outRelationship = outRelationships[i];
            const cardinality = outRelationship.getCardinality();

            workload += cardinality * this.getWorkload(outRelationship.getTarget());
        }

        return workload;
    }

    getAllWorkloadsMetrics(): Array<Partial<QuantitativeMetric>> {
        const externalBehaviours = this.model.getAllByType(ExternalBehaviour);
        let result: Array<Partial<QuantitativeMetric>> = [];

        for (let i = 0; i < externalBehaviours.length; i++) {
            const behaviour = externalBehaviours[i];
            const inRelationships = this.model.getInRelationships(behaviour);
            const internalBehaviour = inRelationships.length === 1 ? inRelationships[0].getSource() : null;

            if (internalBehaviour instanceof InternalBehaviour) {
                const internalBehaviorInRelationships = this.model.getInRelationships(internalBehaviour);
                const resources = internalBehaviorInRelationships.filter(r => r.getSource() instanceof Resource);
                const resource = resources.length === 1 ? resources[0].getSource() : null;

                if (resource) {
                    const workload = this.getWorkload(behaviour);

                    result.push({
                        resource: resource.getName(),
                        externalBehaviour: behaviour.getName(),
                        internalBehaviour: internalBehaviour.getName(),
                        workload
                    });
                } else {
                    throw new Error(`Model is corrupted for quantitative analysis. Missing Resource`);
                }
            }
        }

        return result;
    }
}

export default WorkloadEngine;