const WorkloadEngine = require("./WorkloadEngine");
const PerformanceEngine = require("./PerformanceEngine");

function formatNumber(number) {
    return number.toFixed(4).replace(".", ",");
}

class QuantitativeAnalysisEngine {
    constructor({model}) {
        this.workloadEngine = new WorkloadEngine({model});
        this.performanceEngine = new PerformanceEngine({model});
    }

    getAllMetrics() {
        const workloadMetrics = this.workloadEngine.getAllWorkloadsMetrics();

        // Combining metrics
        let metrics = this.performanceEngine.getAllPerformanceMetrics();

        for (let i = 0; i < workloadMetrics.length; i++) {
            const workloadMetric = workloadMetrics[i];

            let metric = metrics.find(m => m.internalBehaviour === workloadMetric.internalBehaviour &&
                m.externalBehaviour === workloadMetric.externalBehaviour);

            metric.workload = workloadMetric.workload;
        }

        return metrics;
    }

    getAllMetricsAsCsv() {
        const sep = ";"
        const metrics = this.getAllMetrics();
        let response = [`resource${sep}service${sep}wLoad${sep}procTime${sep}respTime${sep}util`];

        for (let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];

            const line =
                `${metric.resource}${sep}` +
                `${metric.externalBehaviour}${sep}` +
                `${metric.workload.toFixed(4)}${sep}` +
                `${metric.processingTime.toFixed(4)}${sep}` +
                `${metric.responseTime.toFixed(4)}${sep}` +
                `${metric.resourceUtilization.toFixed(4)}`;

            response.push(line);
        }

        return response;
    }
}

module.exports = QuantitativeAnalysisEngine;