import WorkloadEngine from "@libs/engines/workload_engine";
import PerformanceEngine from "@libs/engines/performance_engine";
import Model from "@libs/model/model";
import QuantitativeMetric from "@libs/model/interfaces/quantitative_metric";
import {formatNumber} from "@libs/utils/format_number";

export default class QuantitativeAnalysisEngine {
    workloadEngine: WorkloadEngine;
    performanceEngine: PerformanceEngine;

    constructor(model: Model) {
        this.workloadEngine = new WorkloadEngine(model);
        this.performanceEngine = new PerformanceEngine(model);
    }

    getAllMetrics() {
        const workloadMetrics = this.workloadEngine.getAllWorkloadsMetrics();
        const metrics: Array<Partial<QuantitativeMetric>> = this.performanceEngine.getAllPerformanceMetrics();

        // Combining metrics
        for (let i = 0; i < workloadMetrics.length; i++) {
            const workloadMetric = workloadMetrics[i];

            let metric = metrics.find(m => m.internalBehaviour === workloadMetric.internalBehaviour &&
                m.externalBehaviour === workloadMetric.externalBehaviour);

            if (metric) {
                metric.workload = workloadMetric.workload;
            }
        }

        return metrics;
    }

    getAllMetricsAsCsv(separator: string) {
        const sep = separator;
        const metrics = this.getAllMetrics();
        let response = [`resource${sep}service${sep}wLoad${sep}procTime${sep}respTime${sep}util`];

        for (let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];

            const line =
                `${metric.resource}${sep}` +
                `${metric.externalBehaviour}${sep}` +
                `${formatNumber(metric.workload)}${sep}` +
                `${formatNumber(metric.processingTime)}${sep}` +
                `${formatNumber(metric.responseTime)}${sep}` +
                `${formatNumber(metric.resourceUtilization)}`;

            response.push(line);
        }

        return response;
    }
}