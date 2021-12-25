const Process = require("../model/Process");
const ExternalBehaviour = require("../model/ExternalBehaviour");
const Resource = require("../model/Resource");

function getLocalFrequency(node) {
    if (node instanceof Process) {
        return node.getRequestFrequency();
    } else {
        return 0;
    }
}

class WorkloadEngine {
    constructor({model}) {
        this.model = model;
    }

    getWorkload(node) {
        const outRelationships = this.model.getOutRelationships(node);
        let workload = getLocalFrequency(node);

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

module.exports = WorkloadEngine;