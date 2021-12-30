import Process from "@libs/model/Process";
import Resource from "@libs/model/Resource";
import ExternalBehaviour from "@libs/model/ExternalBehaviour";
import Model from "@libs/model/Model";
import ModelElement from "@libs/model/ModelElement";

class WorkloadEngine {
    model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    getWorkload(node: ModelElement) {
        const outRelationships = this.model.getOutRelationships(node);
        let workload = node instanceof Process ? (node as Process).getRequestFrequency() : 0;

        for (let i = 0; i < outRelationships.length; i++) {
            const outRelationship = outRelationships[i];
            const cardinality = outRelationship.getCardinality();

            workload += cardinality * this.getWorkload(outRelationship.getTarget());
        }

        return workload;
    }

    getAllWorkloadsMetrics() {
        const externalBehaviours = this.model.getAllByType(ExternalBehaviour);
        let result = [];

        for (let i = 0; i < externalBehaviours.length; i++) {
            const behaviour = externalBehaviours[i];
            const inRelationships = this.model.getInRelationships(behaviour);
            const internalBehaviour = inRelationships.length === 1 ? inRelationships[0].getSource() : null;
            const internalBehaviorInRelationships = this.model.getInRelationships(internalBehaviour);
            const resources = internalBehaviorInRelationships.filter(r => r.getSource() instanceof Resource);
            const resource = resources.length === 1 ? resources[0].getSource() : null;
            const workload = this.getWorkload(behaviour);

            result.push({
                resource: resource.getName(),
                externalBehaviour: behaviour.getName(),
                internalBehaviour: internalBehaviour.getName(),
                workload
            });
        }

        return result;
    }
}

export default WorkloadEngine;