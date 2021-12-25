const WorkloadEngine = require("./WorkloadEngine");
const PerformanceEngine = require("./PerformanceEngine");

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

    getAllMetricsAsCsv(separator) {
        const metrics = this.getAllMetrics();
        let response = [`resource${separator}service${separator}wLoad${separator}procTime${separator}respTime${separator}util`];

        for (let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];

            const line =
                `${metric.resource}${separator}` +
                `${metric.externalBehaviour}${separator}` +
                `${metric.workload.toFixed(4)}${separator}` +
                `${metric.processingTime.toFixed(4)}${separator}` +
                `${metric.responseTime.toFixed(4)}${separator}` +
                `${metric.resourceUtilization.toFixed(4)}${separator}`;

            response.push(line);
        }

        return response;
    }
}

module.exports = QuantitativeAnalysisEngine;